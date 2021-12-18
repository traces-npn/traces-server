// Recupera les posiscions dels dispositius sincronitzats
// l'ID del dispositiu es recepciona pel paràmetre n de getPosition(n)
const http = require('http');
const GeoJSON = require('geojson');    
const punts = require('./punts');
const { timeStamp } = require('console');

var posicio='';

// Carrega les constants definides al fitxer de configuració de traccar
const traccar = require('../../config/api_tracar.js');

function getPosition(id, i) {  
  var options = {
    "method": "GET",
    "hostname": traccar.hostname,
    "port": traccar.port,
    "path": "/api/positions?deviceId="+ id,    // S'afeix l'ID del dispositiu
    "headers": traccar.headers    
  };
    
  const req = http.request(options, function (res) {            
    const chunks = [];
    
    var track = [];
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
      var lat =  jsonParsed[0].latitude;
      var lng =  jsonParsed[0].longitude;
      var alt =  jsonParsed[0].altitude;
      var time = jsonParsed[0].fixTime;

      // access elements
      //console.log(jsonParsed[0])      
      //console.log("Posició: "+n);
      //console.log("Dispositiu ID:"+ deviceId);
      //console.log("Nivell de bateria: " +  batteryLevel )      

//      if(deviceId===51) {
//        console.log(i+ " Device:" + deviceId+ " lat: " + lat  + " lng: " + lng + " alt: " + alt + " time: " + time + " bateria: " + batteryLevel);				
//    }

      //console.log("------------------------------------");

      //track.push( {runner_id:n, lat:lat, lng:lng, time:time});
      //var pos = GeoJSON.parse(track[0], {Point: ['lat', 'lng']});
      var t=timeStamp;      
      posicio = GeoJSON.parse({runner_id:id, lat:lat, lng:lng, alt:alt, time:time, batteryLevel:batteryLevel}, {Point: ['lat', 'lng', 'alt']}, {Temps: t});        
      punts.setPunt(deviceId, posicio);
      ///tracks.creaGPX(deviceId, posicio);  ==> Canviar-ho per una funció que escrigui en fitxer ???
      //  funcions.addFitxer(`data/track${n}.txt`,pos,`Track ${n} guardat`);                        
      //  funcions.addFitxer(`data/track${n}_max.txt`,jsonParsed[0],`Track ${n} guardat`);                  
      
    }); 
  });
  req.end();
 }

 exports.getPosition = getPosition;
 exports.posicio=posicio;