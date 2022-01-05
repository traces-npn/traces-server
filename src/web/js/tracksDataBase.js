// Recupera els tracks de cada dispositiu de la bdd i els pinta en el mapa.
function dibuixaTracksDataBase() {
  // Array que contindrà la posició anterior de cada dispositiu per dibuixar les polilínies.
  var posAnt = [];      
      
  // consulta els dispositius actius
  const url = `${api_traces.url}/dispositius`;   
  fetch(url)
    .then(response => response.json())              
    .then(dispositius => new Promise((resolve, reject) => {   
      dispositius.forEach( function (dispositiu) {  
        console.log("Recuperant track de la base dades, dispositiu: "+dispositiu.device_id)
        llegirPosicions(dispositiu.device_id);
      })
    }))
    
  function llegirPosicions(id) { 
    const url = `${api_traces.url}/tracks/${id}`;        
    fetch(url)
      .then(response => response.json())              
      .then(track => new Promise((resolve, reject) => {   
        track.forEach( function (punt) {                    
          let x=punt.coords[1];            
          let y=punt.coords[0];                                
          let coords ="";
          let aux=posAnt[trackList.indexOf(id.toString())];          
          // Si no existeix la posició anterior assigna l'actual.
          if (aux === undefined)  coords=`${x}, ${y},`;                                  
          else coords=`${aux},`   
          coords=coords+`${x}, ${y}`;
          posAnt[trackList.indexOf(id.toString())]=`${x}, ${y}`;                
          // Deixa les coordenades de cada segment separades per comes a la variable linia.              
          let linia=coordArray(coords);          
          // Dibuixa el nou segment del track                      
          nouSegmentTrack(linia)                    
          setTimeout(() => {
            resolve(track);
          }, 1000); })
      }))
      //.then((json) =>  { codi     })            
    .catch(error => {
      console.log(`Error: ${error}`);      
    } );                          
  } // Fi llegirPosicions()

  function nouSegmentTrack(linia) {               
    let polyline = L.polyline(linia, { weight: 3, color: 'green' });            
    polyline.addTo(this.map);

  }  
}
