const http = require('http');

const posicions = require('./posicions');
const tracks = require('../carrega/carregaTracks');

// Carrega les constants definides al fitxer constants.js
var constants = require('../tracar_constants');

// Assigna les constants 
const hostname = constants.hostname;
const port = constants.port;
const headers = constants.headers;

var options = {
  "method": "GET",
  "hostname": hostname,
  "port": port,
  "path": "/api/devices",  
  "headers": headers
};


function getDispositius() {  
    const req = http.request( options, function (res) {        
      const chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);	
      });
      res.on("end", function () {
        const data = Buffer.concat(chunks);
        var dispositius = JSON.parse(data);

        // Recorre tots els dispositius recuperats de Traccar
        
        dispositius.forEach(element => {          
          (function myLoop(i) {         
            // Llegeix l'atribut id que identifica el dispositiu sincronitzat de cada corredor 
            var id=element["id"];                                                    
            
            // Crida la funció de llegir la posició de cada dispositiu amb un delay de xxx milisegons.
            setTimeout(function() {	  
              // Crida la funció getPosition que obté les posicions de cada dispositiu i les registra
              // en format GeoJSON a la bdd a través de l'APIREST                   
              posicions.getPosition(id,i);  
              if (--i) myLoop(i);         // Itera i mentre i > 0
            }, 1000)                      // Milisegons d'espera
          })(1000000);    // Quantitat de lectures 
         
        });        

/*
        dispositius.forEach(element => {          
          (function myLoop(i) {         
            // Llegeix l'atribut id que identifica el dispositiu sincronitzat de cada corredor 
            var id=element["id"];                                                    
            
            // Crida la funció de llegir la posició de cada dispositiu amb un delay de xxx milisegons.
                // Crida la funció getPosition que obté les posicions de cada dispositiu i les registra
              // en format GeoJSON a la bdd a través de l'APIREST                   
              posicions.getPosition(id);  
              if (--i) myLoop(i);         // Itera i mentre i > 0
  
          })(1000000);    // Quantitat de lectures 
        
        });
*/
            
      });
            
    });
  req.end();
}

exports.getDispositius = getDispositius; 
