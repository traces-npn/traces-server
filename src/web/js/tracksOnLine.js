//const { user } = require("pg/lib/defaults");

function dibuixaTracksOnline() {
  // Array que contindrà els marcadors de cada corredor.
    var markers = [];    
    trackList.forEach(element => {   
      markers.push([element,null]);       
    })   
             
    // Array que contindrà la posició anterior de cada dispositiu per dibuixar les polilínies.
    var posAnt = [];      

    // trackList conté la llista d'identificadors dels dispositius a trackejar.  
    // element conté l'atribut id que identifica el dispositiu sincronitzat de cada corredor         
    trackList.forEach(element => {
      (function myLoop(i) {              
        // Crida la funció actualitzarPosicions                       
        actualitzarPosicions(element);   
        // Crida la funció de llegir la posició de cada dispositiu amb un delay de xxx milisegons.
        setTimeout(function() {	                          
          if (--i) myLoop(i);         // Itera i mentre i > 0                    
        }, 5000)                      // Milisegons d'espera        
      })(1000000000);    // Quantitat de lectures           
    });  

    
    function actualitzarPosicions(dorsal) {      
      const url = `${api_traccar.url}/devices?uniqueId=${dorsal}`;                    
      const options = {
        "method": "GET",
        "headers": {
          "Authorization": "Basic YWRtaW46YWRtaW4=" 
        }
      }
      fetch(url,options)
      .then(response => response.json())
      .then(data => new Promise((resolve, reject) => {   
        let corredor=data[0];       
        if(corredor.status==="online") 
        {
          llegirPosicio(corredor);             
        }     
      }))
      .catch(error => {
        //alert(id + ' - ' + dorsal )
        console.log(`Error: ${error}`);      
      } );
      
      
    function llegirPosicio(corredor) {
      // Consulta posicions a l'API de Traccar
      const dorsal=corredor.uniqueId;
      const nom=corredor.name;
      const id=corredor.id;
      const url = `${api_traccar.url}/positions?deviceId=${id}`; 
      const options = {
        "method": "GET",
        "headers": {
          "Authorization": "Basic YWRtaW46YWRtaW4=" 
        }
      }           
      fetch(url,options)
        .then(response => response.json())              
        .then(track => new Promise((resolve, reject) => {                            
            let x=track[0].latitude;            
            let y=track[0].longitude;
            let z=Math.round(track[0].altitude);
            let t=track[0].deviceTime;       
            let bateria=track[0].attributes.batteryLevel;      
            let coords ="";
            let descCorredor=`<font size="+0"><b>${dorsal} ${nom}</b></font>`;
            let infoCorredor=`<br><br><b>Bateria:</b> ${bateria} %<br><b>Lat:</b> ${x}<br><b>Lng:</b> ${y}<br><b>Alt:</b> ${z} m.`
            let aux=posAnt[trackList.indexOf(dorsal)];

            // Si no existeix la posició anterior assigna l'actual.
            if (aux === undefined)  coords=`${x}, ${y},`;                        
            else coords=`${aux},`   
            coords=coords+`${x}, ${y}`;
            posAnt[trackList.indexOf(dorsal)]=`${x}, ${y}`;                

            // Deixa les coordenades de cada segment separades per comes a la variable linia.              
            let linia=coordArray(coords);          

            // Dibuixa el nou segment del track                      
            nouSegmentTrack(dorsal, linia)           
                       
            // Obté dades de la parella i dibuixa la icona amb el globus d'informació            
            llegirParella(dorsal, function(descParella,x1, y1) {     
                let infoParella = `<br><b>Parella:</b> ${descParella} `
                //console.log(`${x} , ${y} , ${x1} , ${y1} `)
                if(x1 === null && y1 === null ) { 
                  infoParella+=`<br>(Sense localització)`
                } 
                else {                
                  let distParella = Math.round(getDistanceBetweenPoints(x,y,x1,y1))              
                  infoParella+=`<br><b>Distància:</b> ${distParella} m.`;              
                }
                let txt=descCorredor + infoParella + infoCorredor;
                //console.log(dorsal, descParella, x1, y1 )                             
                dibuixaEsquiador(dorsal,linia[1], txt )
            })
           

        }))
      .catch(error => {
        //alert(id + ' - ' + dorsal )
        console.log(`Error: ${error}`);      
      } );                          
    } // Fi llegirPosicio     
  } // Fi actualitzarPosicions

  function nouSegmentTrack(id, linia) {               
      let polyline = L.polyline(linia, { weight: 3, color: 'green' });            
      polyline.addTo(this.map);
    
    // Recorre l'array de marcadors i elimina la marca de l'esquiador anterior.
    markers.forEach(element => {   
      if(element[0]==id) { 
        if(element[1])  map.removeLayer(element[1]);        
      }     
    })        
  }

  function dibuixaEsquiador(id, pos, desc) {                        
    var Icon = L.Icon.extend({
      options: {
          //shadowUrl: '/img/esquiador-shadow.png',
          iconSize:     [80, 80],
          //shadowSize:   [40, 40],
          iconAnchor:   [40, 40],
          //shadowAnchor: [40, 0],
          popupAnchor:  [0, -50] 
      }
    });

    var esquiadorIcon = new Icon({iconUrl: '/img/esquiador.png'});    
    var desc=`<br> ${desc}`;           
    //Crea el marcador a la nova posició de cada corredor
    var icona = L.marker(pos, {icon:esquiadorIcon}).bindPopup(desc).addTo(map)         
    markers[trackList.indexOf(id)][1]=icona;        
    icona.on('mouseover', function(event){
      icona.openPopup();
    });
  }


  function paintPosition(n,pos, desc)    
  {
    //console.log("Dibuixant waypoint: ", n + " - " + desc);
    /*
     //const pos=[lat, lng];      
     var  marker = L.marker(pos)
     .addTo(map)
     .bindPopup(desc)  
     */
    
    var Icon = L.Icon.extend({
          options: {
              //shadowUrl: '/img/esquiador-shadow.png',
              iconSize:     [80, 80],
              //shadowSize:   [40, 40],
              iconAnchor:   [40, 40],
              //shadowAnchor: [40, 0],
              popupAnchor:  [-3, -76]
          }
      });
  
      var esquiadorIcon = new Icon({iconUrl: '/img/esquiador.png'});      
      var icona = L.marker(pos, {icon: esquiadorIcon}).bindPopup(desc).addTo(map);      
  }

function llegirParella(dorsal, callback) {
    const url = `${api_traces.url}/parelles/${dorsal}`;  
    fetch(url)
        .then(response => response.json())              
        .then(users => new Promise((resolve, reject) => {                   
            var dorsalParella=users[0].device_id
            var ret= dorsalParella + ' ' + users[0].nom + ' ' + users[0].cognoms;            
            
            llegirPosicioParella(dorsalParella, function(posx, posy) {                                               
              // La funció callback retorna posició x,y de la parella.              
              callback(ret, posx, posy);          
            })                          
        })
        .catch(error => {
            console.log(`Error: ${error}`);      
        }));
}

// Retorna una funció callback amb la coordenades de la posició de la parella
function llegirPosicioParella(dorsal,callback) {
  
  const url = `${api_traccar.url}/devices?uniqueId=${dorsal}`;                    
  const options = {
    "method": "GET",
    "headers": {
      "Authorization": "Basic YWRtaW46YWRtaW4=" 
    }
  }
  fetch(url,options)
  .then(response => response.json())
  .then(data => new Promise((resolve, reject) => {   
    let parellaId=data[0].id;    
    
    //let id = data[0].id;                                 

      // Consulta posicions a l'API de Traccar
      //const dorsal=corredor.uniqueId;
      //const nom=corredor.name;
      //const id=corredor.id;
          const url = `${api_traccar.url}/positions?deviceId=${parellaId}`; 
          const options = {
            "method": "GET",
            "headers": {
              "Authorization": "Basic YWRtaW46YWRtaW4=" 
            }
          }       
          fetch(url,options)
            .then(response => response.json())                          
            .then(pos => new Promise((resolve, reject) => {           
              let x;
              let y;
                if(pos[0] === null) {  
                  // Si la parella no retorna posició, retornem la posicio a null
                  x=null;
                  y=null;
                } else {
                  x=pos[0].latitude;            
                  y=pos[0].longitude;                                                         
                }
              callback(x, y);
              }))
          .catch(error => {
            console.log(`Error: ${error}`);      
          })
      }
  ))
  .catch(error => {
    //alert(id + ' - ' + dorsal )
    console.log(`Error: ${error}`);      
  } );  
}

} // Fi dibuixaTracksOline



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
