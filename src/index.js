const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const http = require('http');

const dispositius = require('./components/recepccio/dispositius');
const usuaris = require('./components/usuaris/usuaris');
const tracks = require('./components/carrega/carregaTracks');

// Inicialitzacions
const app = express();
const server = http.Server(app);

// configuració del motor de plantilles basat en ejs-mate
app.engine('ejs', engine); 
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

// Ruta per defecte de l'aplicació que carrega el mapa amb Leaflet
app.use('/',            require('./routes/mostraMapa.js'));

// Ruta /corredors amb el llistat de corredors, resultats,...
app.use('/corredors',   require('./routes/llistaCorredors.js'));

app.use('/tracks',      require('./routes/llistaTracks.js'));
app.use('/demo',        require('./routes/demo.js'));
app.use('/prova',       require('./routes/prova.js'));


// Comproba els dispositius dels corredors
// /components/api_traccar/dispositius.js


// Abans de crear usuaris s'han de borrar les taules runners i points 
// i deixar comentades les línies de getDispositius() i carregaTracks()



// Obté els dispositius sincronitzats i inicia la recepcció de posicions
// desant en bdd els tracks de cada dispositiu 
// 
// Per iniciar la recepció de posicions cal iniciar el server de trackar
// i revisar els dispositius sincronitzats.

/*
// Funcions d'eliminació i càrrega dels dispositius
dispositius.resetDispositius();
setTimeout(() => {
    usuaris.setDispositiusRunners();        
}, 5000);
*/

dispositius.getDispositius();

// Comproba a la bdd si hi ha tracks registrats 
// En cas trobar-ne genera un fitxer amb el track de cada dispositiu sincronitzat 
// components/carrega

//tracks.carregaTracks();    


// Crea els usuaris de prova
// Els usuaris han de coincidir amb els donats d'alta a traccar  (pendnet sincronitzar altes)
function creaUsuaris() {
    
    //usuaris.setUsuari(14, "Jaume","Casanovas",14);    
    /*
    usuaris.setUsuari(49, "Window - Pixel 2","Android",16);      
    usuaris.setUsuari(16, "16 - Pixel 4","", 49);      

    usuaris.setUsuari(50, "50 - Pixel 3","", 51);
    usuaris.setUsuari(51, "51 - Pixel 3","", 50);        

    usuaris.setUsuari(52, "52 - Motorola","", 52);
    */
}

// Publicació de la carpeta del servidor “public”
app.use(express.static(path.join(__dirname,'public')));

// Inici servidor
server.listen(3000, () => {   console.log('http://localhost:3000/');  });
