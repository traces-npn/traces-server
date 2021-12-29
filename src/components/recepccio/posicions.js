// Recupera les posiscions dels dispositius sincronitzats
// l'ID del dispositiu es recepciona pel paràmetre n de getPosition(n)
const http = require('http');
const GeoJSON = require('geojson');    
const moment = require('moment');      

const punts = require('./punts');
const { timeStamp } = require('console');

const distMinProximitat = 100;  // Metres de tolerància de proximitat als controls.
var posicio='';

// Carrega les constants definides al fitxer de configuració de traccar i traces
const api_traccar = require('../../config/api_tracar.js');
const api_traces = require('../../config/api_traces.js');

function getPosition(id,dorsal) {  
  var options = {
    "method": "GET",
    "hostname": api_traccar.hostname,
    "port": api_traccar.port,
    "path": "/api/positions?deviceId="+ id,    
    "headers": api_traccar.headers    
  };
  
  const req = http.request(options, function (res) {            
    const chunks = [];
    
    //var track = [];
    res.on("data", function (chunk) {
      chunks.push(chunk);	
    });
    res.on("end", function () {
      // json data
      const data = Buffer.concat(chunks);       
      
      // parse json
      var jsonParsed = JSON.parse(data);
      
      
      var deviceId = jsonParsed[0].deviceId;            
      var batteryLevel = jsonParsed[0].attributes.batteryLevel;
      var motion = jsonParsed[0].attributes.motion;
      var valid = jsonParsed[0].valid;
      var lat =  jsonParsed[0].latitude;
      var lng =  jsonParsed[0].longitude;
      var alt =  jsonParsed[0].altitude;
      var time = jsonParsed[0].fixTime;

      var t=timeStamp;                      
      //posicio = GeoJSON.parse({device_id:dorsal, lat:lat, lng:lng, alt:alt, time:time, batteryLevel:batteryLevel}, {Point: ['lat', 'lng', 'alt']}, {Temps: t});        
      //punts.setPunt(dorsal, posicio);

      posicio = GeoJSON.parse({device_id:dorsal, lat:lat, lng:lng, alt:alt, time:time, batteryLevel:batteryLevel}, {Point: ['lat', 'lng', 'alt']}, {Temps: t});        
      punts.setPunt(dorsal, posicio);

      comprobarControls(posicio);    
    }); 
  });
  req.end();
 }

 function comprobarControls(pos) {
   //console.log(pos)    
    const x =  pos.geometry.coordinates[1];
    const y =  pos.geometry.coordinates[0]
    const id = pos.properties.device_id;    
    const t = pos.properties.time;
  

  // Recupera la llista de controls, si la posició està a prop d'un control registre el control de pas.
 getControls(function (controls)  {
    controls.forEach(element => {
    //  console.log (element)            
      const controlId = element.control_id;
      const controlY = element.coords[0];
      const controlX = element.coords[1];
      const controlDesc = element.desc;

      // Calcula la distància amb cada punt de control
      var d=getDistanceBetweenPoints(controlX, controlY, x, y)
      //console.log(`${id} Punt ${x}, ${y} - ${controlDesc}: ${d} metres`);        

      //console.log(controlId + ' ' + controlDesc )
      // Mira si la distància està dins el límit de la tolerància de proximitat
      if (d < distMinProximitat  ) {            
        // Control del Puigmal
        if(controlId===1)  { 
          getControlsCorredors(id, controlId, function (controlsCorredors) {   
            // Si el control no està registrat es registra a la bdd          
            if (controlsCorredors.length == 0) {
              //console.log(`${id} Puigmal`)
              console.log(`${id} Puigmal: Punt de control registrat: ${controlDesc} a ${d} metres.`);
              setControl(id,controlId,pos);         
            }
          })
        }
        // Control de Núria
        if(controlId===2)  { 
          //console.log (`${id} Núria`)
          getControlsCorredors(id, controlId, function (controlsCorredors) {   
            // Si el control no està registrat es registra a la bdd          
            if (controlsCorredors.length == 0)  {  
              // Es comprova si s'ha registrat el pas pel Puigmal
              getControlsCorredors(id, 1, function (controlCim) {   
                if (controlCim.length > 0) { 
                  console.log(`${id} Núria: Punt de control registrat: ${controlDesc} a ${d} metres.`);
                  setControl(id,controlId,pos);
                 } else {
                  console.log(`${id} Núria: Punt de control no registrat`);
                 }
              })
            }    
          })}
      }
    });  
  }) /// Fi getControls
} // Fi comprobarControls

      /*

        // Recupera els controls registrats pel corredor
        getControlsCorredors(id, controlId, function (controlsCorredors) {   
          // Si el control no està registrat es registra a la bdd          
          if (controlsCorredors.length == 0)
          {  // Si es tracte del control de núria es coprova si ja ha passat pel cim,
             if(controlId === 1 ){              
              getControlsCorredors(id, 0, function (controlCim) {   // Es comprova si s'ha registrat el cim
                    if (controlCim.length > 0) { 
                      console.log(`${id} Núria: Punt de control registrat: ${controlDesc} a ${d} metres.`);
                      setControl(id,1,pos);                       
                    } 
                  })
             } else   {
             console.log(`${id} Puigmal: Punt de control registrat: ${controlDesc} a ${d} metres.`);
              setControl(id,controlId,pos);                       
             }
          } 
      })                  
     }
    
     });                       
  });
/// Fi getControls
*/


 
 function setControl(deviceID,controlID,pos){

  const data = JSON.stringify({
    "device_id": deviceID,
    "control_id": controlID,
    "geojson": pos
  })   

  var options = {
    "method": "POST",
    "hostname": api_traces.host,
    "port":  api_traces.port,
    "path": "/runners_controls",
    "headers": {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };    
    
  const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      process.stdout.write(d)
    })
  })
  
  req.on('error', error => {
    console.error(error)
  })
  
  req.write(data)
  req.end()
 }

 // Recupera els controls del corredors registrats i retorna el resultat en una funció callback
function getControlsCorredors(id,controlId,callback) {      
  var options = {
    "method": "GET",
    "hostname": api_traces.host,
    "port":  api_traces.port,
    "path": "/runners_controls/"+id+"/"+controlId    
  };    
  
  const req = http.request( options, function (res) {        
  const chunks = [];  
  
  res.on("data", function (chunk) {
       chunks.push(chunk);	
  });
  res.on("end", function () {
      const data = Buffer.concat(chunks);
      var resposta = JSON.parse(data);      
      callback(resposta);
    });                  
  });              
  req.end()            
}


// Recupera els controls definits a la bdd retorna el resultat en una funció callback
function getControls(callback) {      
    var options = {
      "method": "GET",
      "hostname": api_traces.host,
      "port":  api_traces.port,
      "path": "/controls"
    };    
  
    const req = http.request( options, function (res) {        
    const chunks = [];  
    
    res.on("data", function (chunk) {
         chunks.push(chunk);	
    });
    res.on("end", function () {
        const data = Buffer.concat(chunks);
        var resposta = JSON.parse(data);
        callback(resposta);
      });                  
    });              
    req.end()            
 }


///
/// Funcions pel càlcul de distàncies
///

/**
 * Conveteix graus a radians.
 * 
 * @param degrees Number of degrees.
 */
 function degreesToRadians(degrees){
  return degrees * Math.PI / 180;
}

/**
* Retorna la distància entre 2 coordenades
* 
* @see https://stackoverflow.com/a/1502821/4241030
* @param lat1 Latitude of the point A
* @param lng1 Longitude of the point A
* @param lat2 Latitude of the point B
* @param lng2 Longitude of the point B
*/
function getDistanceBetweenPoints(lat1, lng1, lat2, lng2){
  // El radio del planeta tierra en metros.
  let R = 6378137;
  let dLat = degreesToRadians(lat2 - lat1);
  let dLong = degreesToRadians(lng2 - lng1);
  let a = Math.sin(dLat / 2)
          *
          Math.sin(dLat / 2) 
          +
          Math.cos(degreesToRadians(lat1)) 
          * 
          Math.cos(degreesToRadians(lat1)) 
          *
          Math.sin(dLong / 2) 
          * 
          Math.sin(dLong / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = R * c;

  return distance;
}



 exports.getPosition = getPosition;
 exports.posicio=posicio;