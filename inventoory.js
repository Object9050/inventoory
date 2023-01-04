import http from 'http'
import fs from 'fs'
import url from 'url'
import {generateFullItemList as httmldoc} from './views/inventoor-full-list.view.js'
import {generateSingleView as singleDoc} from './views/inventory-single.view.js'
import {generateEditedItem as editItem} from './views/inventory-edit.view.js'

const hostname = '127.0.0.1'
const port = '3000'

//Ein Server erstellen ...
let server = http.createServer(OnUserRequest);
// ... und auf Port 3000 auf anfragen warten
server.listen(port,hostname, () => {console.log(`Server is Listening on ${hostname}:${port}`)})

//(Beispiel-)Daten aus JSON-Datei laden
let items;
fs.readFile('./data/items.json', (err, data) => {
    items = JSON.parse(data);
})


let counter=0;
function OnUserRequest(req, res){

    console.log(counter)

    let parsedURL = url.parse(req.url, true)
     
    if(req.url === "/"){ //Das ist die Startseite
        //res.setHeader ('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end (httmldoc(items))
    } else if (req.url === "/ueber"){
        res.setHeader ('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end (`<h1>Das ist meine &Uumlber Mich Seite</h1> `)

    }
    else{ 
        let splitedURL = parsedURL.pathname.split('/')//req.url.split('/')
        if(splitedURL.includes("delete") && splitedURL.length == 3){
            //delete items[0]
            let item_to_delete = splitedURL[2]
            items.splice(item_to_delete,1)
            res.end (httmldoc(items))

        }
        else if (splitedURL.includes("details") && splitedURL.length == 3){
                //delete items[0]
                const id_position = 2;
                let item_to_show = splitedURL[id_position]
                console.log("details, id: " + item_to_show)
                //let item = Object.values(items[item_to_show])
                // items = items[item_to_show].toString()
                // res.end (`<h1> Hat geklappt</h1> ${item}`)
                res.end(singleDoc(items[item_to_show]))
        }
        else if (splitedURL.includes("edit") && splitedURL.length == 3){
            //delete items[0]
            const id_position = 2;
            let item_to_show = splitedURL[id_position]
            console.log("details, id: " + item_to_show)
            let item = Object.values(items[item_to_show])
            // items = items[item_to_show].toString()
            // res.end (`<h1> Hat geklappt</h1> ${item}`)
            res.end(editItem(items[item_to_show]))
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