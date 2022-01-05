const http = require('http');

const posicions = require('./posicions');

// Carrega les constants definides al fitxer de configuració de traccar
const traccar = require('../../config/api_tracar.js');

const options = {
  "method": "GET",
  "hostname": traccar.hostname,
  "port": traccar.port,
  "path": "/api/devices",  
  "headers": traccar.headers
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
        //console.log(dispositius)
        
        dispositius.forEach(element => {                              
          ( function myLoop(i) {         
            // Llegeix l'atribut id que identifica el dispositiu sincronitzat de cada corredor 
            let id=element["id"];           // identificador dispositiu a Traccar
            let dorsal=element["uniqueId"]; // dorsal             
            // console.log(id + ' - ' + element.status)
            // Únicament obté posicions dels dispositius actius.              
            if(element.status === "online") {                
              // Crida la funció de llegir la posició de cada dispositiu amb un delay de xxx milisegons.
              setTimeout(function() {	  
                // Crida la funció getPosition que obté les posicions de cada dispositiu i les registra
                // en format GeoJSON a la bdd a través de l'APIREST   
                //console.log( id + ' - ' +  dorsal)
                posicions.getPosition(id,dorsal);  
                if (--i) myLoop(i);         // Itera i mentre i > 0              
              }, 1000)                      // Milisegons d'espera
            } 
            else
            { // Dispositius aturats
              //console.log(id + " aturat")
            }
          })(1000000000);    // Quantitat de lectures          
        });                    
      });            
    });
  req.end();
}




function resetDispositius() {  
  console.log("Eliminant dispositius...")
  const options = {
    "method": "GET",
    "hostname": traccar.hostname,
    "port": traccar.port,
    "path": "/api/devices",  
    "headers": traccar.headers
  };
    const req = http.request( options, function (res) {        
      const chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);	
      });
      res.on("end", function () {
        const data = Buffer.concat(chunks);
        var dispositius = JSON.parse(data);
        // Recorre tots els dispositius de Traccar i els elimina        
        dispositius.forEach(element => {                                        
           deleteDispositiu(element.id);
        });                    
        console.log(`${dispositius.length} Dispositius eliminats`)
      });            
    }); 
  req.end();
}

// Elimina el dispostiu id de Traccar 
function deleteDispositiu(id) {  
  const options = {
    "method": "DELETE",
    "hostname": traccar.hostname,
    "port": traccar.port,
    "path": "/api/devices/"+id,  
    "headers": traccar.headers
  };

  const req = http.request(options, function (res) {
    const chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function () {
      const body = Buffer.concat(chunks);
      //console.log(body.toString());
    });
  });
  
  req.end();

}



exports.getDispositius = getDispositius; 
exports.resetDispositius = resetDispositius;