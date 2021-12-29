
function dibuixaTracksOnline() {
    var markers = [];
    trackList.forEach(element => {   
      markers.push([element,null]);  
    })   
    
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
        let id = data[0].id;                         
        if(data[0].status==="online")   llegirPosicio(id,dorsal);
      }))
      .catch(error => {
        //alert(id + ' - ' + dorsal )
        console.log(`Error: ${error}`);      
      } );
      
      
      function llegirPosicio(id,dorsal) {
      // Consulta posicions a l'API de Traccar
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
            let z=track[0].altitude;
            let t=track[0].deviceTime;                      
            let coords ="";
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
            
            /*
            setTimeout(() => {
              resolve(track);
            }, 1000);
            */
        }))
        //.then((json) =>  { codi     })            
      .catch(error => {
        //alert(id + ' - ' + dorsal )
        console.log(`Error: ${error}`);      
      } );                          
    } // Fi actualitzarPosicions()
  
  }

    function nouSegmentTrack(id, linia) {               
      let polyline = L.polyline(linia, { weight: 3, color: 'green' });            
      polyline.addTo(this.map);
                     
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
    var desc=`Dorsal ${id}`;   
    
    // Recorre l'array de marcadors i elimina la marca de l'esquiador anterior.
    markers.forEach(element => {   
      if(element[0]==id) { 
        if(element[1])  map.removeLayer(element[1]);        
      }     
    })    
    //Crea el marcador a la nova posició de cada corredor
    var icona = L.marker(linia[1], {icon:esquiadorIcon}).bindPopup(desc).addTo(map)         
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
  
  


        
    // Array que contindrà la posició anterior de cada dispositiu per dibuixar les polilínies.
    var posAnt = [];      

    // trackList conté la llista d'identificadors dels dispositius a trackejar.    
    trackList.forEach(element => {            
      (function myLoop(i) {         
        // Llegeix l'atribut id que identifica el dispositiu sincronitzat de cada corredor 
            var id=element;                                                                        
            // Crida la funció de llegir la posició de cada dispositiu amb un delay de xxx milisegons.
            setTimeout(function() {	  
            // Crida la funció getPosition que obté les posicions de cada dispositiu i les registra
            // en format GeoJSON a la bdd a través de l'APIREST    
            
              actualitzarPosicions(id);
          if (--i) myLoop(i);         // Itera i mentre i > 0
        }, 1500)                      // Milisegons d'espera
      })(1000000);    // Quantitat de lectures 
    
    });  // Fi tracklist    



  } // Fi dibuixaTracksOline