const { EMLINK } = require("constants");
const http = require("http");
const router = require('express').Router();

const hostname = "localhost";
const port = "3001";

llistaTracks=[];


iteraUsuaris()


function iteraUsuaris(){

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
        const data = Buffer.concat(chunks);
        var corredors = JSON.parse(data);
        // Recorre tots els dispositius detectats        
        //resposta.forEach(element => {                 console.log(resposta)       });
        //console.log(     JSON.stringify(resposta )       )
            
        iteraTracks(corredors)                      
      });
    });    
    req.end()
}

function iteraTracks(corredors){
  corredors.forEach(element => {    
    var options = {
    "method": "GET",
    "hostname": hostname,
    "port": port,
    "path": "/tracks/"+element.device_id
  };
  const req = http.request( options, function (res) {        
      const chunks = [];
        res.on("data", function (chunk) {
          chunks.push(chunk);	
        });
        res.on("end", function () {
          const data = Buffer.concat(chunks);          
          var resposta = JSON.parse(data);  
          // Recorre tots els dispositius detectats        
          resposta.forEach(element => {                 
            llistaTracks.push(element)
          });         
          renderJson(resposta)                  
        });
      });      
      req.end()

  })

}

function renderJson(resposta) {      
  var cadJS= "<script> itemList="+ JSON.stringify(resposta) +"; </script>"
    //console.log(cadJS)
  router.get('/', (req, res) => {                  
    // Renderitza a .ejs passant dades per { dataJS: cadJS }                
    res.render('llistaTracks.ejs', {dataJS: cadJS});      
  });
}




//var data = usuaris.getUsuaris();
//var data = usuaris.getProva();

//console.log( data );


module.exports = router;