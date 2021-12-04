const http = require('http');

// Assigna les constants 
const hostname = "localhost";
const port = "3001";

function getProva() { 
  const cad = [
    { "id": 243, "nom": 'Usuari 1', "cognoms": 'Poma', "dorsal": 200, "sincro": false },
    { "id": 243, "nom": 'Usuari 2', "cognoms": 'Poma', "dorsal": 200, "sincro": false }    
  ]

  return cad;

}

function getUsuaris() {  
  var options = {
    "method": "GET",
    "hostname": hostname,
    "port": port,
    "path": "/users"
  };

  const req = http.request( options, function (res) {        
    const chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);	
      });
      res.on("end", function () {
        const data = Buffer.concat(chunks);
        var resposta = JSON.parse(data);
        //console.log(resposta)
        // Recorre tots els dispositius detectats
        
        resposta.forEach(element => {
//            console.log(resposta)          
        });       
      });
    });      
    req.end()  
  }
  
  function setUsuari(device_id, nom, cognoms, dorsal) {      
    const data = JSON.stringify({
      "device_id": device_id,
      "nom": nom,
      "cognoms": cognoms,
      "dorsal": dorsal      
    })

    const options = {
      hostname: hostname,
      port: port,
      path: '/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }
    
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

 exports.getProva  = getProva;
 exports.getUsuaris  = getUsuaris;
 exports.setUsuari  = setUsuari;
 
 