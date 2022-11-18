'use strict'

let express = require ('express');
let configController = require('../controllers/ConfigController');

let api = express.Router();
let auth = require('../middlewares/authenticate');
let multiparty = require('connect-multiparty');
let path = multiparty({uploadDir: './uploads/configuraciones'});

//Configuraciones de la tienda
api.put('/actualizar_config_admin/:id',[auth.auth,path],configController.actualizar_config_admin);
api.get('/obtener_config_admin',auth.auth,configController.obtener_config_admin);
api.get('/obtener_logo/:img',configController.obtener_logo);
api.get('/obtener_config_publico',configController.obtener_config_publico);

module.exports = api;