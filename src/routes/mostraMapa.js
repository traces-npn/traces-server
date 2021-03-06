const router = require('express').Router();
const fs = require('fs');

// Llegeix el fitxer de tracks creats i els deixa a l'array llistaTracks per enviar
// el JavaScript a mostraMapa.ejs a través de res.render 
const path_tracks='./src/web/tracks/tracks.dat';
var data = fs.readFileSync(path_tracks, 'utf-8');

var llistaTracks = data.split(/\r?\n/);  // Deixa cada línia del fitxer en una posició de l'array llistaTracks
llistaTracks.pop();  // Elimina l'element de l'últim salt de línia.
var cadJS= "<script> trackList="+ JSON.stringify(llistaTracks) +"; //alert(trackList) </script>"

  // Renderitza mostraMapa.ejs passant dades per { dataJS: cadJS }                
  router.get('/', (req, res) => {                      
    res.render('mostraMapa.ejs', {dataJS: cadJS});      
  });

module.exports = router;

