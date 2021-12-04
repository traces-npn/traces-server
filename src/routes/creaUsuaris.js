// Rutes
const http = require("http");
const router = require('express').Router();
const path = require('path');

const hostname = "localhost"
const port = "3001"

const usuaris = require('../components/usuaris.js');


/*
Per executar aquest fitxer s'ha d'afegir a la ruta de /index.js
usuaris.setUsuari("xx","xxxx",200);

usuaris.setUsuari();

module.exports = creaUsuari;

*/

