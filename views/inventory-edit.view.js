export function generateEditedItemView(item){
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inventoory</title>

        <!--materializecss-->
        <!--Import Google Icon Font-->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        
        <!-- Compiled and minified CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@materializecss/materialize@1.2.0/dist/css/materialize.min.css">
        
        <!-- Compiled and minified JavaScript -->
        <script src="https://cdn.jsdelivr.net/npm/@materializecss/materialize@1.2.0/dist/js/materialize.min.js"></script>
            

        <!--Zuletzt meine eigenen Styles => naeher am Objekt-->
        <link rel="stylesheet" href="styles/mystyles.css">
    </head>
    <body>
    <div class="container" > 
        <nav>
            <div class="nav-wrapper">
                <a href="/" class="brand-logo">logo</a>
                <a href="#" data-target="mobile-nav-menu" class="sidenav-trigger"><i class="material-icons">menu</i></a>
                <!--Das Menu in der Desktop Ansicht-->
                <ul class="right hide-on-med-and-down">
                    <li><a href="#">Inventar</a></li>
                    <li id="btn_settings_Desktop"><a href="#">Einstellungen</a></li>
                </ul>
            </div>
        </nav>
        <!-- Das Hamburger-Menu in der mobile Ansicht-->
        <ul class="sidenav" id="mobile-nav-menu">
            <li><a href="#">Inventar</a></li>
            <li id="btn_settings_mobile"><a href="#">Einstellungen</a></li>
        </ul>
    </div>
    
    <main id="inventoory-app">
        <div class="container ">
            <div class="row">
                <div class="col s12">
                    <h1 class="left-align" id="main-h1-header">${item.name}</h1>
                </div>
            </div>
            <div class="row ">       
            ${generateEditItemForm(item)}         
                
            </div>
        </div>
    </main>
    
    <footer class="container page-footer blue-grey darken-3">    
        <div class="row">
        <div class="col l6 s12">
            <h5 class="white-text">Deine smarte Inventarverwaltung</h5>
            <p class="grey-text text-lighten-4">Verwealte alle Deine Dinge. Einfach da wo Du bist</p>
        </div>
        
        </div>
        
        <div class="footer-copyright blue-grey darken-4">
            <div class="container">
                <div class="row">
                    <div class="col s4"> © 2023 inventoory</div>
                    <div class="col s4 offset-s4">
                        <a class="grey-text text-lighten-4 right" href="#!">More Links</a>
                    </div>
                </div>  
            </div>
        </div>
    </footer>

    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.sidenav');
            var instances = M.Sidenav.init(elems);
        });   
    </script>
</body>
</html>`

return html;

};



function generateEditItemForm(item){
    let keys = Object.keys(item)
    let values = Object.values(item)

    let editItemHTML = `<form action="/save" method="POST" id="saveForm">`
    // keys.forEach(element => { //Warum geht es hiermit nicht?
    for (let element = 0; element < keys.length; element++) {
        editItemHTML += `<label for="${keys[element]}">${keys[element]} ändern</label>
        <input name="${keys[element]}" id="${keys[element]}" type="text" value="${values[element]}"></input><br><br>`
    };
    editItemHTML += `<button form="saveForm" type="submit" value="Submit">Speichern</button>
                    </form>`

    // let editItemHTML =  `<form action="/save" method="POST" id="saveForm">
    //                         <label for="name">Bezeichnung ändern</label>
    //                         <input name="name" id="name" type="text" value="${item.name}"></input>
    //                         <label for="typ">Typ ändern</label>
    //                         <input name="typ" id="typ" type="text" value="${item.typ}"></input>
    //                         <label for="neupreis">Neupreis ändern</label>
    //                         <input name="neupreis" id="neupreis" type="text" value="${item.neupreis}"></input>
    //                         <label for="ort">Ort ändern</label>
    //                         <input name="ort" id="ort" type="text" value="${item.ort}"></input>
    //                         <button form="saveForm" type="submit" value="Submit">Speichern</button>
    //                     </form>`
return editItemHTML
}