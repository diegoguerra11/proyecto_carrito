'use strict'

let express = require ('express');
let carritoController = require('../controllers/carritoController');

let api = express.Router();
let auth = require('../middlewares/authenticate');

//Crud Simple
api.post('/agregar_carrito_cliente',auth.auth,carritoController.agregar_carrito_cliente);
api.post('/comprobar_carrito_cliente',auth.auth,carritoController.comprobar_carrito_cliente);
api.put('/actualizar_cantidad_carrito_cliente/:id/:cantidad',auth.auth,carritoController.actualizar_cantidad_carrito_cliente);
api.get('/obtener_carrito_cliente/:id',auth.auth,carritoController.obtener_carrito_cliente);
api.delete('/eliminar_carrito_cliente/:id',auth.auth,carritoController.eliminar_carrito_cliente);


module.exports = api;