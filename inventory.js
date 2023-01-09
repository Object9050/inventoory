// SQL only for test purposes. It is not implemented in the actual application.
import sqlite3 from 'sqlite3'
import http from 'http'
import fs from 'fs'
import url from 'url'
import {parse} from 'querystring'
import {generateFullItemList as fullView} from './views/inventory-full-list.view.js'
import {generateSingleView as singleView} from './views/inventory-single.view.js'
import {generateEditedItemView as editItem} from './views/inventory-edit.view.js'
import { createRandomID } from './helper/utils.js'

const hostname = '127.0.0.1'
const port = '3005'

// create SQLITE DB
// './db/sample.db'
let db = new sqlite3.Database('./db/sample.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the sample SQlite database.');
  });

// CREATE SQLITE TABLE
db.run('CREATE TABLE IF NOT EXISTS \
Logs(id INTEGER PRIMARY KEY, logMsg TEXT)');

// Enter log message into database
let id = createRandomID()
let logData = `Dies ist eine Random ID: ${id}`
let sqlQuery = `INSERT INTO Logs VALUES (NULL, :logMsg)`
db.run(sqlQuery,[logData]);
//// Simple variant
// db.run('INSERT INTO Logs VALUES (NULL, "Das ist die Log-Message")');

// print all data contained in SQLITE table
db.all("SELECT * FROM Logs", function(err, rows) {
    rows.forEach(function (row) {
      console.log(row.id + ": " + row.logMsg);
    });
   });

//Einen Server erstellen ...
let server = http.createServer(OnUserRequest);
// ... und auf Port 3000 auf anfragen warten
server.listen(port,hostname, () => {console.log(`Server is Listening on ${hostname}:${port}`)})



// Load data from json file
let items;
let itemsDefault;
const pathToJSON = './data/items.json'
const pathToDefaultJSON = './data/items-default.json'

fs.readFile(pathToJSON, (err, data) => {
    items = JSON.parse(data)
    for(let element = 0; element < items.length; element++) {
        let itemID = createRandomID()
        if (items[element].id == undefined){
            items[element].id = itemID
        } else {
            console.log("ID bereits vorhanden");
        }
    }
    // Convert into raw data with stringify, then write into json file.
    let newItemsRaw = JSON.stringify(items);
    fs.writeFile(pathToJSON, newItemsRaw, (err) => {console.log("Alles Super beim schreiben der Datei")})
})
// Loading data from default JSON file with keys without values. Needed to prevent null pointer exception
// when items.json is empty (after the deletion of the last element). 
fs.readFile(pathToDefaultJSON, (err, data) => {
    itemsDefault = JSON.parse(data)
})


let counter=0;
function OnUserRequest(req, res){

    console.log(counter)

    let parsedURL = url.parse(req.url, true)
     
    if(req.url === "/"){ //Das ist die Startseite
        //res.setHeader ('Content-Type', 'text/html'); QUESTION: Wofür diese Zeile? ANSWER: Mit UTF8 als Zeichencode würden Umlaute interpretiert.
        res.statusCode = 200;
        res.end (fullView(items))
    } 
    else if (req.url === "/ueber"){
        res.setHeader ('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end (`<h1>Das ist meine &Uumlber Mich Seite</h1> `)

    }
    else{ 
        let splittedURL = parsedURL.pathname.split('/') //req.url.split('/')
        if(splittedURL.includes("delete") && splittedURL.length == 3){

            let item_to_delete = splittedURL[2]
            items.splice(item_to_delete,1)
            // As long as object 'items' has got contents use items, else use items-default.
            // Needed to prevent null pointer exception
            if (items[0] != null){
                res.end (fullView(items))
            }
            else {
                res.end (fullView(itemsDefault))
            }

        }
        else if (splittedURL.includes("details") && splittedURL.length == 3){
            const id_position = 2;
            let item_to_show = splittedURL[id_position]
            res.end(singleView(items[item_to_show]))
        }
        else if (splittedURL.includes("edit") && splittedURL.length == 3){
            res.setHeader ('Content-Type', 'text/html');
            res.statusCode = 200;
            const id_position = 2;
            let item_to_edit = splittedURL[id_position]
            res.end(editItem(items[item_to_edit]))
        }
        else if (splittedURL.includes("addItem")){
            res.setHeader ('Content-Type', 'text/html');
            res.statusCode = 200;

            // Als Schablone nehmen wir das 0. Element
            // QUESTION: Was genau passiert hier?
            let item_to_add = {}
            let keys = Object.keys(itemsDefault[0])
            for (let i = 0; i < keys.length; i++){
                item_to_add[keys[i]] = "";
            }
            // let newItem = {
            //     "name":"",
            //     "typ":"",
            //     "neupreis":"",
            //     "ort":""
            //     };
            item_to_add.id = createRandomID()
            items.push(item_to_add);
            let item_pos_to_add = items.length-1
            res.end(editItem(items[item_pos_to_add]))
        }
        else if (splittedURL.includes("save") && req.method == "POST"){
            let formData = []
            // Listening for event 'data'. Create anonymous function with param 'chunk'.
            // Push 'chunk' into variable formData.
            req.on('data', (chunk) => {
                formData.push(chunk);
                             })
            req.on('end', () => {
                formData = Buffer.concat(formData).toString();
                let dataToSave = parse(formData);
                // Save to position in array where ID between item and form match
                for (let i=0; i<items.length; i++){
                    if(items[i].id == dataToSave.id){
                        items[i] = dataToSave;    
                    }
                }                
                // Convert into raw data before adding to JSON
                var newItemRaw = JSON.stringify(items);
                fs.writeFile(pathToJSON, newItemRaw, (err) => {
                    // Error checking
                    if (err) throw err;
                    console.log("Data saved");
                });
                res.writeHead(302,{location: '/', 'content-type':'text/html'});
                res.end (fullView(items));
            });

        }
        else if (splittedURL.includes("addKaktus")){
            let kaktus = {
                "name":"Kaktus",
                "typ":"Pflanze",
                "neupreis":"1,50 EUR",
                "ort":"Fensterbank"
                };
            kaktus.id = createRandomID()
            items.push(kaktus);
            // Convert into raw data before adding to JSON
            var newItemRaw = JSON.stringify(items);
            fs.writeFile(pathToJSON, newItemRaw, (err) => {
                // Error checking
                if (err) throw err;
                console.log("Kaktus added");
            });
            res.end (fullView(items))
        }
        else{
            // Bei allen andern habe ich einen Fehler => 404
            res.setHeader ('Content-Type', 'text/html');
            res.statusCode = 404;
            res.end (`<h1>404 <h1><h2>Ohh, da ist etwas schiefggelaufen</h2>`)
        }
    }
    counter++
}