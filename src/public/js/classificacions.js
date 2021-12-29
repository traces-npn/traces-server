
// Mostra la taula de corredors actualitzant els temps d'ascens, descens i total.    
 function dibuixaClassificats(menu) {     
    if(menu) var slideMenu = L.control.slideMenu('', {position: 'topright', menuposition: 'topright', width: '50%', height: '100%', delay: '0', icon: 'fa-chevron-left'}).addTo(map);       
    // El paràmetre menu indica la forma de visualització de la taula de classificacions
    // Si és true es mostrarà integrada dins del menú desplegable del mapa
    // Si és false es mostrarà en una pàgina independent

    
  // S'actualitza cada 5 segons i es reordena per ordre de classificació.
  (function myLoop(i) {
      taulaClassificacions();
          //  Fa una pausa a cada iteració (if i > 0)
          setTimeout(function() { if (--i) myLoop(i);  
      }, 5000)  // Espera 5 segons
  })(10000000);                   //  pass the number of iterations as an argument    

  function taulaClassificacions() {
      let contents = 
      `<h1>Classificacions 49a Núria - Puigmal - Núria</h1>
      <hr><table id="customers"><tr><th>Dorsal</th><th>Nom</th><th>Cognoms</th><th>Dorsal Parella</th><th>Nom Parella</th>
      <th>Núria</th><th>Puigmal</th><th>Núria</th><th>Ascens</th><th>Descens</th><th>Total</th></tr>`;                               

      const url = `${api_traces.url}/temps`;  
      fetch(url)
          .then(response => response.json())              
          .then(users => new Promise((resolve, reject) => {                   
              users.forEach( function (item) {                         
                  var temps_ascens = '';
                  var temps_descens = '';
                  var total =  '';
                  var t;

                  // Moment general de sortida de la cursa
                  var t0 = iniciCursa;
                  var h0 = moment.utc(t0).format("HH:mm:ss");
                  
                  // Moment individual de pas pel cim 
                  var t1 = moment.utc(item.rc1_temps);                               
                  var h1=moment.utc(t1).format("HH:mm:ss");         
                  // Moment d'arribada al final de la cursa
                  var t2 = moment.utc(item.rc2_temps);   
                  var h2 = moment.utc(t2).format("HH:mm:ss");                                     
                  
                                  
                  // El corredor no ha passat per cap control de cim ni d'arribada
                  if(!item.rc1_temps && !item.rc2_temps) {                          
                      h1 = "";
                      h2 = "";                                            
                  }
                  
                  // El corredor no ha passat pel contol del cim
                  if(!item.rc1_temps && item.rc2_temps) {                          
                      t2 = moment.utc(item.rc2_temps);                               
                      h2=moment.utc(t2).format("HH:mm:ss");                                 
                      h1 = "";                        
                      total= "";                      
                  }

                  // El corredor només ha passat pel contol del cim
                  if(item.rc1_temps && !item.rc2_temps) {  
                      t = t1.diff(t0);
                      temps_ascens = moment.utc(t).format("HH:mm:ss");
                      h2 = "";
                      
                  }
                  
                  // El corredor ha passat pels dos controls (cim i arribada)
                  if(item.rc1_temps && item.rc2_temps) {                          
                      t = t1.diff(t0);
                      temps_ascens = moment.utc(t).format("HH:mm:ss");
                      let tt = t2.diff(t1)
                      temps_descens = moment.utc(tt).format("HH:mm:ss");
                      t = moment(t).add(moment.duration(tt));
                      total = moment.utc(t).format("HH:mm:ss");                                       
                  }
                                              
              contents+=`<tr><td>${item.device_id}</td><td>${item.nom}</td><td>${item.cognoms}</td>
                  <td>${item.parella_id}</td><td>${item.nom_parella} </td>
                  <td>${h0}</td><td>${h1}</td><td>${h2}</td><td>${temps_ascens}</td><td>${temps_descens}</td><td>${total}</td></tr>`;

              });
              
              contents+=`</table>`;
              
              if(menu) { // Es carrega dins la capa del menú desplegable de la dreta                     
                slideMenu.setContents(contents);
              } else {  //  Es carrega dins de la capa de la pàgina /classificacions
                document.getElementById('capa').innerHTML = contents;
              }

          })
          .catch(error => {
              console.log(`Error: ${error}`);      
          }));
  } // Fi taulaClassificacions()
   
  }