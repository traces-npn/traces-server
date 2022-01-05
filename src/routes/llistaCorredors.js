
const router = require('express').Router();

var cadJS= "<script> usuarisList=''; </script>"
       
            router.get('/', (req, res) => {                  
                // Renderitza a .ejs passant dades per { dataJS: cadJS }                
                res.render('llistaCorredors.ejs', {dataJS: cadJS});   
            });   

module.exports = router;