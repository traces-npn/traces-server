
const http = require("http");
const router = require('express').Router();
const path = require('path');


const hostname = "localhost";
const port = "3001";

const usuaris = require('../components/usuaris');

//////////////////
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
        // json data
        const data = Buffer.concat(chunks);
        // parse json
        var resposta = JSON.parse(data);
        //console.log(resposta)
        // Recorre tots els dispositius detectats
        
        /*resposta.forEach(element => {
                  console.log(resposta)
          
        });*/        
        //console.log(resposta)        
//        console.log(     JSON.stringify(resposta )       )
            
        var cadJS= "<script> usuarisList="+ JSON.stringify(resposta) +"; </script>"
        //var cad= resposta;
//        console.log(cadJS)
            router.get('/', (req, res) => {                  
                // Renderitza a .ejs passant dades per { dataJS: cadJS }                
                res.render('llistaCorredors.ejs', {dataJS: cadJS});      
                
            
            
            });
            
      });


    });
    
    req.end()


//////////////////


//var data = usuaris.getUsuaris();
//var data = usuaris.getProva();

//console.log( data );




module.exports = router;