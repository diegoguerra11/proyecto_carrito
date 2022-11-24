'use strict'

let express = require ('express');
let productoController = require('../controllers/productoController');

let api = express.Router();
let auth = require('../middlewares/authenticate');
let multiparty = require('connect-multiparty');
let path = multiparty({uploadDir: './uploads/productos'});

//PRODUCTOS
api.post ('/registro_producto_admin',[auth.auth,path],productoController.registro_producto_admin);
api.get ('/listar_productos_admin/:filtro?',auth.auth, productoController.listar_productos_admin);
api.get ('/obtener_portada/:img',productoController.obtener_portada);
api.get ('/obtener_producto_admin/:id', auth.auth, productoController.obtener_producto_admin);
api.put('/actualizar_producto_admin/:id',[auth.auth,path], productoController.actualizar_producto_admin);
api.delete('/eliminar_producto_admin/:id',auth.auth,productoController.eliminar_producto_admin);
api.put('/actualizar_producto_letiedades_admin/:id',auth.auth,productoController.actualizar_producto_variedades_admin);
api.put('/agregar_imagen_galeria_admin/:id',[auth.auth,path],productoController.agregar_imagen_galeria_admin);
api.put('/eliminar_imagen_galeria_admin/:id',auth.auth,productoController.eliminar_imagen_galeria_admin);

//INVENTARIO
api.get('/listar_inventario_producto_admin/:id', auth.auth, productoController.listar_inventario_producto_admin);
api.delete('/eliminar_inventario_producto_admin/:id',auth.auth,productoController.eliminar_inventario_producto_admin);
api.post('/registro_inventario_producto_admin',auth.auth,productoController.registro_inventario_producto_admin);

//PUBLICOS
api.get('/listar_productos_publico/:filtro?' ,productoController.listar_productos_publico);
api.get('/obtener_productos_slug_publico/:slug', productoController.obtener_productos_slug_publico);
api.get('/listar_productos_recomendados_publico/:categoria',productoController.listar_productos_recomendados_publico);
api.get('/listar_productos_nuevos_publico',productoController.listar_productos_nuevos_publico);
api.get('/listar_productos_masvendidos_publico',productoController.listar_productos_masvendidos_publico);

module.exports = api;