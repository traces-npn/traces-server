const http = require('http');
const api_traces = require('../../config/api_traces.js');

// Assigna les constants 
//const hostname = "localhost";
//const port = "3001";
const path_tracks="./src/web/tracks/";
const path_tracks_dat=path_tracks+'tracks.dat';

// Recupera els tracks de tots els corredors de la bdd i genera un fitxer .gpx

function carregaTracks() {  
  
  var options = {
    "method": "GET",
    "hostname": api_traces.host,
    "port":  api_traces.port,
    "path": "/runners"
  };
  
  const req = http.request( options, function (res) {        
  const chunks = [];  
  var tracks=[];
  res.on("data", function (chunk) {
       chunks.push(chunk);	
  });
  res.on("end", function () {
      const data = Buffer.concat(chunks);
      var resposta = JSON.parse(data);
      // Crea el fitxer de tracks en blanc
      crearFitxer(path_tracks_dat,'') 
      // Recupera la llista d'usuaris i itera per cadascun.  
      resposta.forEach(element => {
          // Crea un fitxer GPX per cada dispositiu
          tracks=crearGPX(element.device_id)                    
          
          // Escriu un fitxer amb els id dels tracks guardats
          addFitxer(path_tracks_dat,element.device_id+'\r\n')  
      });       

//      let txt="";
//      tracks.forEach(element => txt+=`${element}\r\n`);     
//      crearFitxer(path_tracks+'tracks.dat', txt.slice(0, -2))              

    });
  });      
    req.end()      
  }
  
  function crearGPX(device_id) {  
    var tracks=[];
    var uri=path_tracks+'track-'+device_id+'.gpx'
    tracks.push(device_id)
    console.log("Creant GPX track: "+ device_id)
    
    // Guarda les urls dels fitxer dels tracks generats            
    // La funció promesaTrack utilitza Promise amb un retard de 100ms per assegurar que l'xml 
    // del fitxer del track monta la capçalera amb l'odre esperant, sense bloqueigs.
                                  
      promesaTrack("Inici")
        .then(() => { 
          crearGpxTrack(uri, device_id)           // Crea el fitxer GPX amb la capçalera del track de cada dispositiu                            
          return promesaTrack('Iniciant track: '+ uri );
        })     
       .then(() => { 
          //console.log(device_id)
          afegirPuntsTrack(uri, device_id)        // Afegeix les línies de les coordenades al fitxer GPX
          return promesaTrack('Creant track: ' + uri );
        })
       .catch(() => { console.log('error'); } );      
  return tracks;
}

function promesaTrack(msg) {
  //console.log(msg)            
  return new Promise((resolve, reject) => {
    setTimeout(() => {    resolve();    }, 500); });
}


function crearGpxTrack(file, id){    
  crearFitxer(file, capGPX(id))
}

function tancarGpxTrack(file) {
  addFitxer(file,peuGPX())  
  //addFitxerSync(file,peuGPX())  
}

// Recuperar els punts desats a la bdd dels tracks del dispositiu passat per paràmetre i els escriu al fitxer del track.
function afegirPuntsTrack(uri, device_id) {   
  
    var options = {
      "method": "GET",
      "hostname": api_traces.hostname,
      "port": api_traces.port,
      "path": "/tracks/"+device_id      
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
          // Recorre tots els punts del dispositiu guardats a la taula de punts i els escriu al fitxer del track
          resposta.forEach(element => {               
            //addFitxerSync(uri, puntGPX(element.coords[1],element.coords[0], element.alt, element.temps ));          
            addFitxer(uri, puntGPX(element.coords[1],element.coords[0], element.alt, element.temps ));          
          });    

          promesaTrack("Tancar track")
          .then(() => { 
            tancarGpxTrack(uri)                    // Afegeix els tags de tancament de track al fitxer GPX                           
          return promesaTrack('Tancant track: '+ uri );
          })
          .catch(() => { console.log('error tancant track'); } );      
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
  fs.writeFile(file, data, 
    {
      encoding: "utf8",
      flag: "w",  // Sobreescriu el fitxer
      mode: 0o666
    },
    (err) => {
    if (err) console.log(err);
  });
}

// Afegeix línies al fitxer <file> amb el contingut <data>
// El fitxer ha d'existir
function addFitxer(file, data) {  
  const fs = require('fs');          
  fs.writeFile(file, data, 
    {
      encoding: "utf8",
      flag: "a", // Obre el fitxer existent
      mode: 0o666
    },
    (err) => {
    if (err) console.log(err);
  });
}

exports.carregaTracks = carregaTracks;