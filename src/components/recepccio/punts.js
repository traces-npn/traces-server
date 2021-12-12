// Guarda els punts a la bdd de Traces a través de la pròpia API de Traces

const axios = require('axios')

function setPunt(device_id, geojson) {   
    const dades = JSON.stringify({
      "device_id": device_id,
      "geojson": geojson    
    })   

  const config = {
    method: 'POST',
    url: 'http://localhost:3001/punts',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': dades.length
    },
    data: dades
  }


  const sendPostRequest = async () => {
    try {
        const resp = await axios(config);
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
        //console.log(err)
    }
  };
  
  sendPostRequest();
 
}  



exports.setPunt = setPunt;
