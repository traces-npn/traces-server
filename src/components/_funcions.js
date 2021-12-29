
////////////////////////////////////////
// Bloc de funcions 
////////////////////////////////////////

function dibuixaTracksOnline() {
    var posAnt = [];  // Array que contindrà la posició anterior de cada dispositiu per dibuixar les polilínies.
    trackList.forEach(element => {            
      (function myLoop(i) {         
        // Llegeix l'atribut id que identifica el dispositiu sincronitzat de cada corredor 
        var id=element;                                                    
      
        // Crida la funció de llegir la posició de cada dispositiu amb un delay de xxx milisegons.
        setTimeout(function() {	  
          // Crida la funció getPosition que obté les posicions de cada dispositiu i les registra
          // en format GeoJSON a la bdd a través de l'APIREST                   
          actualitzarPosicions(id)
          if (--i) myLoop(i);         // Itera i mentre i > 0
        }, 1500)                      // Milisegons d'espera
      })(1000000);    // Quantitat de lectures 
    
    });
    
  
  function actualitzarPosicions(id) {
    
      const url = `http://localhost:8082/api/positions?deviceId=${id}`;    
      const options = {
          "method": "GET",
          "headers": {
          "Authorization": "Basic YWRtaW46YWRtaW4="
          }
      }
      var track='';
  
      fetch(url,options)
          .then(response => response.json())        
          .then(json => {                  
            let x=track=json[0].latitude;
            let y=track=json[0].longitude;
            let z=track=json[0].altitude;
            let t=track=json[0].deviceTime;          
                  
            var coords ="";
            var aux=posAnt[trackList.indexOf(id)];
            if (aux === undefined)  {
              coords=`${x}, ${y},`;            
            }
            else {
              coords=`${aux},`          
            }
            coords=coords+`${x}, ${y}`;
            posAnt[trackList.indexOf(id)]=`${x}, ${y}`;
            
            //console.log(coords)
          
  
            var linia=coordArray(coords);          
            //console.log(coordsArray)
            var polyline = L.polyline(linia, { weight: 3, color: 'green' });
            polyline.addTo(this.map);
            
            //paintPosition(id,`[${x}, ${y}]`)
  
            //var  marker = L.marker(pos)
  //          var esquiadorIcon = new Icon({iconUrl: '/img/esquiador.png'});
              //var icona = L.marker(pos, {icon: esquiadorIcon}).bindPopup(desc).addTo(map);
  
  /*
                
                d1=getDistanceBetweenPoints(puntPuigmal[0], puntPuigmal[1], x, y)
                d2=getDistanceBetweenPoints(puntNuria[0], puntNuria[1], x, y)
                console.log(id + " - Distància al  Puigmal: " + d1);
                console.log(id + " - Distància a Núria    : " + d2);
  */
  
          } )   
      
    }
  
  }
  
  
  // Recupera els tracks enmmagatzemats i els mostra en el mapa.
  // La llista dels tracks a mostrar s'extreu de l'array trackList 
  // que s'obté via res.render a traves de mostrarMapa.ejs 
  // enviat per components/carrega/tracks.js des  mostrarMapa.ejs 
  // Els fitxers .gpx es guarden al back i es recuperen des del front.
  function dibuixaTracksDataBase() {
    trackList.forEach( function (item) {
      
      var gpx= `./tracks/track-${item}.gpx`;
      //console.log(`Track: ${gpx}`)  
      var g = new L.GPX(gpx, {  async: true,  parseElements: ['track'],  polyline_options: {    color: 'blue'  } });
  
     g.addTo(map);
  
     g.on('loaded', function(e) {
      var gpx = e.target,
        name = gpx.get_name(),
        distM = gpx.get_distance(),
        distKm = distM / 1000,
        distKmRnd = distKm.toFixed(1),
        eleGain = gpx.get_elevation_gain().toFixed(0),
        eleLoss = gpx.get_elevation_loss().toFixed(0);
        var info = name + "</br>" +
        "Distància: " + distKmRnd + " km </br>" +          
        "Desnivell: " + eleGain + " m </br>"
        gpx.getLayers()[0].bindPopup(info) //register popup on click
    });
  
    })
  } 
  
  function drawTrack(track) {
    let coordinates = track.points.map(p => [p.lat.toFixed(5), p.lon.toFixed(5)]);
  
    var polyline = L.polyline(coordinates, { weight: 6, color: 'darkred' }).addTo(mymap);
  
    // zoom the map to the polyline
    mymap.fitBounds(polyline.getBounds());
  }
  
  
  
  function dibuixaTrack(id,color) {
     // Carrega el track de la cursa npn.gpx i el mostra en vermell sobre el mapa
     var gpx = `./tracks/${id}.gpx`;
     var g = new L.GPX(gpx, {  async: true,  parseElements: ['track'], polyline_options: {  color: color  }  });
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
  
  function dibuixaTrackCursa() {
    // Carrega el track de la cursa npn.gpx i el mostra en vermell sobre el mapa
    var gpx = './tracks/npn.gpx';
    dibuixaTrackGPX(gpx)  
  }
  
  
  function dibuixaTrackGPX(gpx) {
    // Dibuixa el track del fitxer gpx passat per paràmetre en vermell sobre el mapa
    
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
  
  function dibuixaPuntsClau() {
    // Afegeix punt addicionals al track de la crusa, sobre el mapa     
        paintPosition('1', puntNuria,'<h3>Punt de sortida</h3>Vall de Núria' );    
     //   paintPosition('2', puntPluviometre,`<h3>Pluviòmatre</h3>Torrent de l'Embut` );    
        paintPosition('3', puntPuigmal,'<h3>Puigmal</h3>Control de cim' );    
    //  paintPosition('4', puntPontCiment,'<h3>Pont de ciment. Torrent de finestrelles</h3>No hi ha neu.' );    
  }      
  
  
  
  
  // Bloc de funcions utilitzades
  function _paintPosition(n,lat, lng, desc)    
  {
    console.log("Dibuixant waypoint: ", n + " - " + desc);
     const pos=[lat, lng];   
     var  marker = L.marker(pos)
     .addTo(map)
     .bindPopup(desc)  
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
  
  
  function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
  }
  
  function puntGPX(x,y,z,t) {  
    return `<trkpt lat="${x}" lon="${y}"> <ele>${z}</ele> <time>${t}</time></trkpt>`;;
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
    \t<name>Track de seguiment de dispositiu</name>\r\n\
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
  



  // Funció per muntar l'array de coordenades en el foramt polyline
  function coordArray(coordString) {
    var coords = coordString.split(",")
    var temp = coords.slice();
    var arr = [];
  
    while (temp.length) {
      arr.push(temp.splice(0,2));
    }          
    return arr;
  }