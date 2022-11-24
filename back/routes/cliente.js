'use strict'

let express = require ('express');
let clienteController = require('../controllers/ClienteController');

let api = express.Router();
let auth = require('../middlewares/authenticate');

//Admin
api.post('/registro_cliente_admin',auth.auth, clienteController.registro_cliente_admin);
api.get('/obtener_cliente_admin/:id',auth.auth,clienteController.obtener_cliente_admin);
api.put('/actualizar_cliente_admin/:id',auth.auth, clienteController.actualizar_cliente_admin);
api.delete('/eliminar_cliente_admin/:id',auth.auth, clienteController.eliminar_cliente_admin);
api.put('/desactivar_cliente_vendedor/:id', auth.auth, clienteController.desactivar_cliente_vendedor);
api.put('/activar_cliente_vendedor/:id', auth.auth, clienteController.activar_cliente_vendedor);

//Cliente
api.post('/registro_cliente',clienteController.registro_cliente);
api.post('/login_cliente', clienteController.login_cliente);
api.post('/confirmar_correo', clienteController.confirmar_correo);
api.put('/cambiar_contrasenia', clienteController.cambiar_contrasenia);
api.get('/listar_clientes_tienda',auth.auth,clienteController.listar_clientes_tienda);
api.get('/obtener_cliente_guest/:id',auth.auth,clienteController.obtener_cliente_guest);
api.put('/actualizar_perfil_cliente_guest/:id',auth.auth,clienteController.actualizar_perfil_cliente_guest);
api.get('/obtener_variedades_productos_cliente/:id',clienteController.obtener_variedades_productos_cliente);

api.put('/actualizar_direccion_cliente/:id',auth.auth, clienteController.actualizar_direccion_cliente);
api.get("/recibir_direccion_cliente/:id",auth.auth,clienteController.recibir_direccion_cliente);



//Productos
api.get('/obtener_productos_slug_publico/:slug',clienteController.obtener_productos_slug_publico);
api.get('/listar_productos_recomendados_publico/:categoria',clienteController.listar_productos_recomendados_publico);

///DIRECCION
api.post('/registro_direccion_cliente',auth.auth,clienteController.registro_direccion_cliente);
api.get('/obtener_direccion_todos_cliente/:id',auth.auth,clienteController.obtener_direccion_todos_cliente);
api.put('/cambiar_direccion_principal_cliente/:id/:cliente',auth.auth,clienteController.cambiar_direccion_principal_cliente);
api.get('/obtener_direccion_principal_cliente/:id',auth.auth,clienteController.obtener_direccion_principal_cliente);
api.delete('/eliminar_direccion_cliente/:id',auth.auth, clienteController.eliminar_direccion_cliente);

//ORDENES
api.post('/registro_pedido_compra_cliente', auth.auth, clienteController.registro_pedido_compra_cliente);
api.get('/obtener_ordenes_cliente/:id', auth.auth, clienteController.obtener_ordenes_cliente);
api.get('/obtener_detalles_ordenes_cliente/:id', auth.auth, clienteController.obtener_detalles_ordenes_cliente);
api.get('/verBoleta/:id', auth.auth, clienteController.obtener_detalles_ordenes_cliente);
api.get('/consultarIDPago/:id',auth.auth,clienteController.consultarIDPago);
api.post('/registro_compra_cliente',auth.auth,clienteController.registro_compra_cliente);

//REVIEWS
api.post('/emitir_review_producto_cliente', auth.auth,clienteController.emitir_review_producto_cliente);
api.get('/obtener_review_producto_cliente/:id', clienteController.obtener_review_producto_cliente);
api.get('/obtener_reviews_cliente/:id', auth.auth, clienteController.obtener_reviews_cliente);
api.get('/obtener_reviews_producto_publico/:id',clienteController.obtener_reviews_producto_publico);
module.exports = api;