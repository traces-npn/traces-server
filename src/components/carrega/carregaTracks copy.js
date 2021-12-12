const http = require('http');
const axios = require('axios');
const fs = require('fs').promises;
const { normalize } = require('path');

// Assigna les constants 
const hostname = "localhost";
const port = "3001";
const path_tracks="./src/public/tracks/";

// Recupera els tracks de tots els corredors de la bdd i genera un fitxer .gpx

function carregaTracks() {  
  var tracks=[];
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
      // Recupera la llista d'usuaris i itera per cadascun.  
      resposta.forEach(element => {
            //console.log(resposta)          

            var uri=path_tracks+'track-'+element.device_id+'.gpx'
            tracks.push(element.device_id)
            // Guarda les urls dels fitxer dels tracks generats            


            // La funció promesaTrack utilitza Promise amb un retard de 150ms per assegurar que l'xml 
            // del fitxer del track es monta amb l'odre correcte esperant, sense bloqueigs, la fi de les 
            // funcions de crear la capçalera, afegir els punts i finalment tancar l'xml.
            // L'ordre d'execució de les funcions ha de ser:
            //crearGpxTrack(uri, element.device_id)                     
            //afegirPuntsTrack(uri, element.device_id)
            //tancarGpxTrack(uri)
               
            function promesaTrack(msg) {
              return new Promise((resolve, reject) => {
                setTimeout(
                  () => {
  //console.log(msg);
                    resolve();
                  }, 1500);      
              });
            }
          
            //console.log('Inici')
            promesaTrack("Inici")
            .then(() => { 
              crearGpxTrack(uri, element.device_id)           // Crea el fitxer GPX amb la capçalera del track de cada dispositiu                            
              return promesaTrack('Inici track: '+ uri );
             })
            .then(() => { 
              afegirPuntsTrack(uri, element.device_id)        // Afegeix les línies de les coordenades al fitxer GPX
              return promesaTrack('Punts track: ' + uri );
             })
             .then(() => { 
              tancarGpxTrack(uri)                             // Afegeix els tags de tancament de track al fitxer GPX
              return promesaTrack('Tancant track: ' + uri);
             })
            
            .catch(() => { console.log('error'); } );

          
        });       

        // Escriu un fitxer amb els id dels tracks guardats a l'array tracks
        let txt="";
//        tracks.forEach(element => txt+=`./tracks/track-${element}.gpx\r\n`);     
        tracks.forEach(element => txt+=`${element}\r\n`);     

        crearFitxer(path_tracks+'tracks.dat', txt.slice(0, -2))        
        //crearFitxerSync(path_tracks+'tracks.dat', txt.slice(0, -2))        


      });
    });      
    req.end()  

    return tracks; 
  }



function crearGpxTrack(file, id){    
  crearFitxer(file, capGPX(id))
}

function tancarGpxTrack(file) {
  addFitxerSync(file,peuGPX())  
}

// Recuperar els punts desats a la bdd dels tracks del dispositiu passat per paràmetre i els escriu al fitxer del track.
function afegirPuntsTrack(uri, device_id) {   
  var options = {
    "method": "GET",
    "hostname": hostname,
    "port": port,
    "path": "/tracks/"+device_id,
    "headers": {
      "Content-Length": "0"
    }
  };
  //console.log(uri)
  //console.log(options.path)
  const req = http.request( options, function (res) {        
    const chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);	
      });
      res.on("end", function () {        
        const data = Buffer.concat(chunks);      
        var resposta = JSON.parse(data);        
        // Recorre tots els punts del dispositiu guardats a la taula de punts    
        resposta.forEach(element => {                         
          addFitxerSync(uri, puntGPX(element.coords[1],element.coords[0], element.alt, element.temps ));          
        });                 
      });
    });      
    req.end()  
  }

function puntGPX(x,y,z,t) {  
  return `\t\t<trkpt lat="${x}" lon="${y}"> <ele>${z}</ele> <time>${t}</time></trkpt>\r\n`;;
}

function peuGPX() {
  return `</trkseg></trk></gpx>`
}

function capGPX(id) {
  return `<?xml version="1.0" encoding="UTF-8"?>\r\n\
  <gpx creator="Traces NPN - https://ce-terrassa.org/npn" version="1.0"\r\n\
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \r\n\
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\r\n\
  <metadata>\r\n\
  \t<name>Track de seguiment de dispositiu: ${id}</name>\r\n\
  \t<author>\r\n\
  \t\t<name>Nom del corredor/a</name>\r\n\
  \t\t<link href="https://ce-terrassa.org/npn">\r\n\
  \t\t\t<text>Traça de la 49a cursa Núria - Puigmal - Núria</text>\r\n\
  \t\t</link>\r\n\
  \t</author>\r\n\
  \t<link href="/npn-dorsal-001">\r\n\
  \t\t<text>Track de seguiment</text>\r\n\
  \t</link>\r\n\
  \t<time>2021-11-29T17:33:23Z</time>\r\n\
  </metadata>\r\n\
  <trk>\r\n\
  \t\t<name>npn-track-${id} - 49a Núria Puigmal Núria</name>\r\n\
  \t\t<trkseg>\r\n`
}
  
// Crea el fitxer <file> amb el contingut <data>
// Si existeix el fitxer el crea de nou
function crearFitxer(file, data){  
  const fs = require('fs');
  var fileContent = JSON.parse(JSON.stringify(data));   
  fs.writeFile(file,  fileContent, (err) => {
    if(err) throw err;        
    console.log(file);  
  });
}

// Mètode Sincron. No s'utilitza.
function crearFitxerSync(file, data){  
  const fs = require('fs');
  var fileContent = JSON.parse(JSON.stringify(data));   
  fs.writeFileSync(file,  fileContent, (err) => {
    if(err) throw err;        
    console.log(file);  
  });
}

// Afegeix al final del fitxer <file> el contingut <data>
function addFitxer(file, data){
  const fs = require('fs');
  var fileContent = JSON.parse(JSON.stringify(data));
 
  var stream = fs.createWriteStream(file, {'flags': 'a'});
  stream.once('open', function(fd) {
    stream.write(fileContent+"\r\n");
  });
}

// Afegeix al final del fitxer <file> el contingut <data>
function addFitxerSync(file, data){
  const fs = require('fs');
  var fileContent = JSON.parse(JSON.stringify(data));
 
  //var stream = fs.createWriteStreamSync(file, {'flags': 'a'});
  
  fs.appendFileSync(file, fileContent, function (err) {
    if(err){
      return  console.log(err);
    }
    //else {              console.log ("Ok.");     }
  })
  
}


 exports.carregaTracks = carregaTracks;