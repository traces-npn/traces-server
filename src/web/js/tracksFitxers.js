
  // Recupera els tracks enmmagatzemats i els mostra en el mapa.
  // La llista dels tracks a mostrar s'extreu de l'array trackList 
  // que s'obté via res.render a traves de mostrarMapa.ejs 
  // enviat per components/carrega/tracks.js des  mostrarMapa.ejs 
  // Els fitxers .gpx es guarden al back i es recuperen des del front.
  function dibuixaTracksFitxers() {
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