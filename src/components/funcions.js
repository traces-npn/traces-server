

function crearFitxer(file, data, msg){
    // Crea un fitxer amb el JSON dels dispositius sincronitzats
    var fs = require('fs');
    const { fileURLToPath } = require('url');
    var fileContent = JSON.stringify(data);
    var filepath = file;      
    fs.writeFile(filepath, fileContent, (err) => {
      if(err) throw err;        
      console.log(msg+filepath);  
    })
  
  }

  function addFitxer(file, data, msg){
    const fs = require('fs');
    var fileContent = JSON.stringify(data);
    var stream = fs.createWriteStream(file, {'flags': 'a'});
    stream.once('open', function(fd) {
      stream.write(fileContent+"\r\n");
    });
  }

function provaFitxer(file, data, msg){
  const fs = require('fs');
  
  // Test the if the file exists
  fs.access(file, fs.constants.F_OK, (err) => {
    console.log('\n> Checking if the file exists');
    
    if (err) {
      console.error('File does not exist');
    
      // Create the file
      console.log('\nCreating the file');
      fs.writeFileSync(file, "Test File");
    
      // Test the if the file exists again
      fs.access('file', fs.constants.F_OK, (err) => {
        console.log('\n> Checking if the file exists');
        if (err)
          console.error('File does not exist');
        else {
          console.log('File does exist');
        }
      });
    }
    else {
      console.log('File does exist');    

      var stream = fs.createWriteStream("udp-stream.log", {'flags': 'a'});
      stream.once('open', function(fd) {
      stream.write(data+"\r\n");
  });


    }
  });
  
  }






  exports.crearFitxer = crearFitxer;
  exports.addFitxer = addFitxer;