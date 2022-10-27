'use strict'

var express = require ('express');
var adminController = require('../controllers/AdminController');
var auth = require('../middlewares/authenticate');
var api = express.Router();

api.post('/registro_admin',adminController.registro_admin);
api.post('/login_admin',adminController.login_admin);

api.get('/obtener_ventas_admin/:desde?/:hasta?',auth.auth,adminController.obtener_ventas_admin);
api.get('/listar_variedades_admin/:id',auth.auth,adminController.listar_variedades_admin);
api.get('/listar_variedades_productos_admin',auth.auth,adminController.listar_variedades_productos_admin);


//venta
api.get('/obtener_detalles_ordenes_cliente/:id',auth.auth,adminController.obtener_detalles_ordenes_cliente);
api.put('/marcar_finalizado_orden/:id',auth.auth,adminController.marcar_finalizado_orden);
api.delete('/eliminar_orden_admin/:id',auth.auth,adminController.eliminar_orden_admin);
api.put('/marcar_envio_orden/:id',auth.auth,adminController.marcar_envio_orden);
api.put('/confirmar_pago_orden/:id',auth.auth,adminController.confirmar_pago_orden);
api.post('/registro_compra_manual_cliente',auth.auth,adminController.registro_compra_manual_cliente);
api.post('/pedido_compra_cliente',auth.auth,adminController.pedido_compra_cliente);
//variedades
api.put('/actualizar_producto_variedades_admin/:id',auth.auth,adminController.actualizar_producto_variedades_admin);
api.delete('/eliminar_variedad_admin/:id',auth.auth,adminController.eliminar_variedad_admin);
api.post('/agregar_nueva_variedad_admin',auth.auth,adminController.agregar_nueva_variedad_admin);

module.exports = api;