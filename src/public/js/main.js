// Codi JavaScript que es carrega al mapa principal a través de mostraMapa.ejs

const puntPluviometre= [42.3906, 2.1242];
const puntNuria=[42.39758, 2.15303];
const puntPuigmal=[42.38326, 2.11678]; 
const puntPontCiment=[42.40028,2.14764];

// Es mostra el mapa centrat al cim del Puigmal
// Es determina la font del mapa 
// S'establexi el zoom per defecte de 12 i el zoom màxim permès.
//var map = L.map('map').setView([42.39758, 2.15303],12);
//var map = L.map('map').setView(puntPuigmal,15);
var map = L.map('map').setView(puntNuria,14); 
map.options.maxZoom=19;

//const tileURL = 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png';
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(tileURL).addTo(map);

//dibuixaPuntsClau();

dibuixaCrono();
dibuixaTrackCursa();
dibuixaControls();
dibuixaTracksDataBase();
dibuixaTracksOnline();

//dibuixaTracksFitxers();

dibuixaClassificats(true);



////////////////////////////////////////
// Bloc de funcions 
////////////////////////////////////////

  // Carrega el track de la cursa npn.gpx i el mostra en vermell sobre el mapa
  function dibuixaTrackCursa() {
    var gpx = './tracks/npn.gpx';
    dibuixaTrackGPX(gpx)  
  }

  // Dibuixa el track del fitxer gpx passat per paràmetre en vermell sobre el mapa
  function dibuixaTrackGPX(gpx) {
    var g = new L.GPX(gpx, {  async: true,  parseElements: ['track'], polyline_options: {  color: 'red'  }  });
    g.addTo(map); 
    g.on('loaded', function(e) {
        var gpx = e.target,
          name = gpx.get_name(),
          distM = gpx.get_distance(),
          distKm = distM / 1000,
          distKmRnd = distKm.toFixed(1),
          eleGain = gpx.get_elevation_gain().toFixed(0),
          eleLoss = gpx.get_elevation_loss().toFixed(0);
          var info = "Track oficial: " + name + "</br>" +
          "Distància: " + distKmRnd + " km </br>" +          
          "Desnivell: " + eleGain + " m </br>"
          gpx.getLayers()[0].bindPopup(info) //register popup on click
    });  
  }
  
  function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
  }
  
  // Funció per muntar l'array de coordenades en el format polyline
  function coordArray(coordString) {
    var coords = coordString.split(",")
    var temp = coords.slice();
    var arr = [];
  
    while (temp.length) {
      arr.push(temp.splice(0,2));
    }          
    return arr;
  }

  // Afegeix punts addicionals al track de la crusa, sobre el mapa     
  function dibuixaPuntsClau() {
        paintPosition('1', puntNuria,'<h3>Punt de sortida</h3>Vall de Núria' );    
     //   paintPosition('2', puntPluviometre,`<h3>Pluviòmatre</h3>Torrent de l'Embut` );    
        paintPosition('3', puntPuigmal,'<h3>Puigmal</h3>Control de cim' );    
    //  paintPosition('4', puntPontCiment,'<h3>Pont de ciment. Torrent de finestrelles</h3>No hi ha neu.' );    
  }      
   
  // Recupera la llista de controls, si la posició està a prop d'un control registre el control de pas.
  function dibuixaControls() {
  
    llegirControls();

    function llegirControls() {  
      const url = `${api_traces.url}/controls`;  
      fetch(url)
      .then(response => response.json())              
      .then(controls => new Promise((resolve, reject) => {   
        controls.forEach( function (control) {  
          dibuixaControl(control);                
          setTimeout(() => {
            resolve(controls);
          }, 1000); })
      }))
      //.then((json) =>  { codi     })            
    .catch(error => {
      console.log(`Error: ${error}`);      
    } );                          
    } // Fi llegirControls()

  }
  
  
  function paintPosition(n,pos, desc)    
  {
    //console.log("Dibuixant waypoint: ", n + " - " + desc);        
     var  marker = L.marker(pos)
     .addTo(map)
     .bindPopup(desc)            
  }

  function dibuixaControl(control)    {       
    var pos=[control.coords[1],control.coords[0]];
    var alt=control.coords[2];    
    var  marker = L.marker(pos)
     .addTo(map)
     .bindPopup(`${control.nom} ${alt} m. <br>${control.desc}` )            
  }

function dibuixaCrono() {
    
  function mostraCrono() {
    var cad='';
    var ara = moment();    
    var tempsCursa = moment.duration(iniciCursa-ara);                 
    
    if(tempsCursa._milliseconds > 0) {      
      cad+=" La cursa encara no ha començat.";
      document.getElementById('crono').innerHTML = cad;

    } else {
      var tempsCursa = moment.duration(ara-finalCursa);                 
      if (tempsCursa._milliseconds > 0) {
        cad+=" Cursa finalitzada." 
        document.getElementById('crono').innerHTML = cad;
      }
      else {        
        var tempsCursa = moment.duration(ara-iniciCursa);                 
        cad+=" Crono: ";
        var dies=tempsCursa.days();
        var hores=tempsCursa.hours();
        var minuts=tempsCursa.minutes();
        var segons=tempsCursa.seconds();                 

        document.getElementById('crono').innerHTML = cad;
        if(dies>0)    document.getElementById('crono').innerHTML += dies + (dies>1?' dies, ':' dia, ');
        if(hores>0)   document.getElementById('crono').innerHTML += hores + (hores>1?' hores, ':' hora, ');
        if(minuts>0)  document.getElementById('crono').innerHTML += minuts + (minuts>1?' minuts, ': ' minut, ');
        document.getElementById('crono').innerHTML += segons + (segons>1?' segons':' segon');
      }
    }   
  }

  timer = setInterval(mostraCrono, 1000);
}

function diahora(m) {  
  let ret= m._hour;
  return ret;
}
