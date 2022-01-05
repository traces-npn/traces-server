// Importació de llibrerires externes
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const http = require('http');

// Importació de fitxers .js interns
const dispositius = require('./components/recepccio/dispositius');
const usuaris = require('./components/usuaris/usuaris');
const tracks = require('./components/carrega/carregaTracks');

// Inicialitzacions servidor
const app = express();
const server = http.Server(app);

// Configuració del motor de plantilles basat en ejs-mate
app.engine('ejs', engine); 
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

// Ruta per defecte de l'aplicació que carrega el mapa amb Leaflet
app.use('/',            require('./routes/mostraMapa.js'));

// Ruta "/corredors" amb el llistat de corredors, resultats,...
app.use('/corredors',   require('./routes/llistaCorredors.js'));

// Rutes de proves
app.use('/tracks',      require('./routes/llistaTracks.js'));
app.use('/demo',        require('./routes/demo.js'));

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
 Funcions d'eliminació i càrrega dels dispositius
 Únicament s'ha d'executar aquest bloc per una càrrega inicial de l'aplicació.
 Prèviament cal fer un buidat de les taules runners i runners_controls i exectuar l'script de càrrega d'usuaris.
 -- delete from runners_controls;
 -- delete from runners;

 dispositius.resetDispositius();        // Elimina tots els dispositius de l'aplicació Traccar.
 setTimeout(() => {     
    usuaris.setDispositiusRunners();    // Crea els dispositius a l'aplicació Traccar a partir dels usuaris carregats a la taula runners    
 }, 5000);

*/

dispositius.getDispositius();

/*
 Comproba a la bdd si hi ha tracks registrats 
 Genera un fitxer amb el track de cada dispositiu sincronitzat 
 /src/components/carrega/carregaTracks.js

 Desactivat ja que ha quedat substituït per la funció tracksDataBase.js de Traces Web
 
 tracks.carregaTracks();    

*/

// Crea usuaris de prova
// L'ID dels usuaris han de coincidir amb els donats d'alta a traccar  
function creaUsuaris() {   
    usuaris.setUsuari(14, "Jaume","Casanovas",14);        
    usuaris.setUsuari(49, "Window - Pixel 2","Android",16);      
    usuaris.setUsuari(16, "16 - Pixel 4","", 49);      
    usuaris.setUsuari(50, "50 - Pixel 3","", 51);
    usuaris.setUsuari(51, "51 - Pixel 3","", 50);        
    usuaris.setUsuari(52, "52 - Motorola","", 52);    
}

// Publicació de la carpeta del servidor “web”
app.use(express.static(path.join(__dirname,'web')));

// Inici servidor
server.listen(3000, () => {   console.log('Traces Server en execució\n\nTraces Web en execució\nhttp://localhost:3000/');  });
