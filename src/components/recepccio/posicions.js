// Recupera les posiscions dels dispositius sincronitzats
// l'ID del dispositiu es recepciona pel paràmetre n de getPosition(n)

const path = require('path');
const http = require('http');
const GeoJSON = require('geojson');    
const punts = require('./punts');

var posicio='';

// Assigna les constants 
const hostname = "localhost";
const port = "8082";
const headers =  {
  "cookie": "JSESSIONID=node01kpp1w0pwm3xb17ybqhyud6svt1.node0",
  "Content-Length": "0",
  "Authorization": "Basic YWRtaW46YWRtaW4="
}

function getPosition(n) {  
  var options = {
    "method": "GET",
    "hostname": hostname,
    "port": port,
    "path": "/api/positions?deviceId="+n,    // S'afeix l'ID del dispositiu
    "headers": headers    
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
  //console.log("lat: " + lat  + " lng: " + lng + " alt: " + alt + " time: " + time + " bateria: " + batteryLevel);				
      //console.log("------------------------------------");

      //track.push( {runner_id:n, lat:lat, lng:lng, time:time});
      //var pos = GeoJSON.parse(track[0], {Point: ['lat', 'lng']});
      
      //posicio = GeoJSON.parse({runner_id:n, lat:lat, lng:lng, alt:alt, time:time, batteryLevel:batteryLevel}, {Point: ['lat', 'lng']});      
      posicio = GeoJSON.parse({runner_id:n, lat:lat, lng:lng, alt:alt, time:time, batteryLevel:batteryLevel}, {Point: ['lat', 'lng', 'alt']});      
  //console.log(posicio)
      punts.setPunt(deviceId, posicio);
  
  //  funcions.addFitxer(`data/track${n}.txt`,pos,`Track ${n} guardat`);                        
  //  funcions.addFitxer(`data/track${n}_max.txt`,jsonParsed[0],`Track ${n} guardat`);                  
       
    });
  });
  req.end();
 }

 exports.getPosition = getPosition;
 exports.posicio=posicio;