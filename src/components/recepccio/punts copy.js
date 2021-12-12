// Guarda els punts a la bdd de Traces a través de la pròpia API de Traces

const http = require('http');

function setPunt(device_id, geojson) {   
    const data = JSON.stringify({
      "device_id": device_id,
      "geojson": geojson    
    })
  
    const options = {
      //hostname: "localhost",
      hostname: "192.168.0.131",
      port: 3001,
      path: '/punts',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }
   //console.log(geojson)
    const req = http.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)
  
      res.on('data', d => {
        process.stdout.write(d)        
      })
    })  
    req.on('error', error => {
      console.error(`captura error! ${res.statusCode} --> ` + error)
    })  
    req.write(data)
    req.end()
   }

 exports.setPunt = setPunt;