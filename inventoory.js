import http from 'http'
import fs from 'fs'
import url from 'url'
import {parse} from 'querystring'
import {generateFullItemList as httmldoc} from './views/inventoor-full-list.view.js'
import {generateSingleView as singleDoc} from './views/inventory-single.view.js'
import {generateEditedItemView as editItem} from './views/inventory-edit.view.js'

const hostname = '127.0.0.1'
const port = '3005'

//Ein Server erstellen ...
let server = http.createServer(OnUserRequest);
// ... und auf Port 3000 auf anfragen warten
server.listen(port,hostname, () => {console.log(`Server is Listening on ${hostname}:${port}`)})

//(Beispiel-)Daten aus JSON-Datei laden
let items;
fs.readFile('./data/items.json', (err, data) => {
    items = JSON.parse(data);
})
// Daten in JSON-Datei schreiben
// let addItem;
// fs.write('./data/items.json', (err, data))


let counter=0;
function OnUserRequest(req, res){

    // console.log(counter)
    // console.log(items)

    let parsedURL = url.parse(req.url, true)
     
    if(req.url === "/"){ //Das ist die Startseite
        //res.setHeader ('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end (httmldoc(items))
    } 
    else if (req.url === "/ueber"){
        res.setHeader ('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end (`<h1>Das ist meine &Uumlber Mich Seite</h1> `)

    }
    else{ 
        let splittedURL = parsedURL.pathname.split('/') //req.url.split('/')
        if(splittedURL.includes("delete") && splittedURL.length == 3){
            //delete items[0]
            let item_to_delete = splittedURL[2]
            items.splice(item_to_delete,1)
            res.end (httmldoc(items))

        }
        else if (splittedURL.includes("details") && splittedURL.length == 3){
            const id_position = 2;
            let item_to_show = splittedURL[id_position]
            res.end(singleDoc(items[item_to_show]))
        }
        else if (splittedURL.includes("edit") && splittedURL.length == 3){
            const id_position = 2;
            let item_to_edit = splittedURL[id_position]
            res.end(editItem(items[item_to_edit]))
        }
        else if (splittedURL.includes("addItem") /* && splittedURL.length == 3 */){
            let newItem = {
                "name":"",
                "typ":"",
                "neupreis":"",
                "ort":""
                };
            items.push(newItem);
            // Convert into raw data before adding to JSON
            var newItemRaw = JSON.stringify(items);
            fs.writeFile('./data/items.json', newItemRaw, (err) => {
                // Error checking
                if (err) throw err;
                console.log("New data added");
            });
            res.end(editItem(items[items.length-1]))
        }
        else if (splittedURL.includes("save") && req.method == "POST"){
            let formData = []
            // Listening for event 'data'. Create anonymous function with param 'chunk'.
            // Push 'chunk' into variable formData.
            req.on('data', (chunk) => {
                formData.push(chunk);
                             })
            req.on('end', () => {
                // let data = req.read()
                formData = Buffer.concat(formData).toString();
                let dataToSave = parse(formData);
                // Funktioniert nur beim Hinzufügen neuer Gegenstände
                // ToDo: IDs hinzufügen
                items[items.length-1] = dataToSave
                // Convert into raw data before adding to JSON
                var newItemRaw = JSON.stringify(items);
                fs.writeFile('./data/items.json', newItemRaw, (err) => {
                    // Error checking
                    if (err) throw err;
                    console.log("Data saved");
                });
                res.writeHead(302,{location: '/', 'content-type':'text/html'});
                res.end (httmldoc(items));
            });

        }
        else if (splittedURL.includes("addKaktus") /* && splittedURL.length == 3 */){
            let newItem = {
                "name":"Kaktus",
                "typ":"Pflanze",
                "neupreis":"1,50 EUR",
                "ort":"Fensterbank"
                };
            items.push(newItem);
            // Convert into raw data before adding to JSON
            var newItemRaw = JSON.stringify(items);
            fs.writeFile('./data/items.json', newItemRaw, (err) => {
                // Error checking
                if (err) throw err;
                console.log("New data added");
            });
            res.end (httmldoc(items))
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