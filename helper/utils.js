/**
 * Generiert eine Einfache ID aus [A-Z]und [0-9]. Die ID ist per Default fünfstellig
 * @param {inter} length: Länge der zu generierenden ID. Default = 5 
 * @returns liefert eine einfache id zurück (=>String)
 */
export function createRandomID(){
    let keys = "ABCDEFGHIJKLMOPQESTUVWXYZ0123456789"
    let length = 5;
    let id = "";
    let key = "";
    while (id.length < length){
        key = keys[Math.floor(Math.random() * keys.length)];
        id += key;
    }
    return id
}