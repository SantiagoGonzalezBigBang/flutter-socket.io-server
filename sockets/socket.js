const {io} = require('../index');
const BandsModel = require('../models/bands_model');
const BandModel = require('../models/band_model');

const bands = new BandsModel();

bands.addBand(new BandModel('Queen'));
bands.addBand(new BandModel('Bon Jovi'));
bands.addBand(new BandModel('Heroes del silencio'));
bands.addBand(new BandModel('Metalica'));


//* Sockets Messages 
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);

        io.emit('mensaje', {admin: 'Nuevo Mensaje'});
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload['id']);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        const newBand = new BandModel(payload['name']);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload['id']);
        io.emit('active-bands', bands.getBands());
    });

    // client.on('emitir-mensaje', (payload) => {
    //     // console.log('Mensaje:', payload);
    //     // io.emit('nuevo-mensaje', payload) //* Emite a todos los clientes
    //     client.broadcast.emit('nuevo-mensaje', payload) //* Emite a todos los clientes menos a el que lo emitio
    // });

});