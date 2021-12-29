
const http = require("http");
const router = require('express').Router();
/*
const path = require('path');


const hostname = "localhost";
const port = "3001";

const usuaris = require('../components/usuaris/usuaris');

//////////////////
var options = {
    "method": "GET",
    "hostname": hostname,
    "port": port,
    "path": "/runners"
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

            
        var cadJS= "<script> usuarisList="+ JSON.stringify(resposta) +"; </script>"
       
            router.get('/', (req, res) => {                  
                // Renderitza a .ejs passant dades per { dataJS: cadJS }                
                res.render('llistaCorredors.ejs', {dataJS: cadJS});   
            });   
      });

    });
    
    req.end()
*/


var cadJS= "<script> usuarisList=''; </script>"
       
            router.get('/', (req, res) => {                  
                // Renderitza a .ejs passant dades per { dataJS: cadJS }                
                res.render('llistaCorredors.ejs', {dataJS: cadJS});   
            });   

module.exports = router;