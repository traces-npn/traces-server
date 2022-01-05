const http = require('http');

// Carrega les constants de configuració de l'api Traces.
const api_traces = require('../../config/api_traces.js');

// Carrega les constants definides al fitxer de configuració de traccar
const traccar = require('../../config/api_tracar.js');


function setDispositiusRunners() {  
  console.log("Creant dispositius")
  var options = {
    "method": "GET",
    "hostname": api_traces.hostname,
    "port": api_traces.port,
    "path": "/runners"
  };

  const req = http.request( options, function (res) {        
    const chunks = [];      
      res.on("data", function (chunk) {
        chunks.push(chunk);	
      });
      res.on("end", function () {
        const data = Buffer.concat(chunks);
        var runners = JSON.parse(data);        
        // Recorre tots els usuaris de traces i crea el dispositiu amb el nom i el dorsal.        
        runners.forEach(runner => {            
          setDispositiu(runner.nom + ' ' + runner.cognoms , runner.device_id)                 
        });       
        console.log(`${runners.length} Dispositius creats`)
      });
    });      
    req.end()  



function setDispositiu(nom, dorsal) {    
//  console.log(`${nom} ${dorsal}`);  

  const data = JSON.stringify(
    {
    "uniqueId": dorsal,
    "name": nom
    })

  //console.log(data);
  
  const options = {
    "method": "POST",
    "hostname": traccar.hostname,
    "port": traccar.port,
    "path": "/api/devices",  
    "headers":  {
      "cookie": "JSESSIONID=node09v6rkhkav0g116wlc9oun0mcz713.node0",
      "Content-Type": "application/json",
      'Content-Length': data.length,      
      "Authorization": "Basic YWRtaW46YWRtaW4="
    }
  };
  const req = http.request(options, res => {
    //console.log(`statusCode: ${res.statusCode}`)
    //if(res.statusCode==400){ console.log("\n\nError 400: "+data)}
    res.on('data', d => {
      //process.stdout.write(d)
    })
  })
  
  req.on('error', error => {
    console.error(error)
  })

  req.write(data)
  req.end()
    
}


}

 
exports.setDispositiusRunners  = setDispositiusRunners;
