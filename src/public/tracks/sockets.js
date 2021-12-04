module.exports = io => {
    io.on('connection', (socket) => {
        console.log('Nou usuari connectat');

        // Escola les coordenades dels altre slcients.
        socket.on('userCoordinates', (coords) => {
            //console.log(coords);            
            // Emet les coordenades a tots els clients connectats
            socket.broadcast.emit('newUserCoordinates',coords)
        });
    });
};
