'use strict'

let express = require ('express');
let vendedorController = require('../controllers/VendedorController');
let auth = require('../middlewares/authenticate');
let api = express.Router();

api.post('/login_vendedor',vendedorController.login_vendedor);
//Pedidos
api.get('/obtener_ventas_vendedor/:desde?/:hasta?',auth.auth,vendedorController.obtener_ventas_vendedor);
api.get('/obtener_detalles_ordenes_vendedor/:id',auth.auth,vendedorController.obtener_detalles_ordenes_vendedor);
api.put('/marcar_finalizado_orden/:id',auth.auth,vendedorController.marcar_finalizado_orden);
api.delete('/eliminar_orden_admin/:id',auth.auth,vendedorController.eliminar_orden_admin);
api.put('/marcar_envio_orden/:id',auth.auth,vendedorController.marcar_envio_orden);
api.put('/confirmar_pago_orden/:id',auth.auth,vendedorController.confirmar_pago_orden);

//Venta
api.post('/registro_compra_manual_cliente',auth.auth,vendedorController.registro_compra_manual_cliente);

//clientes
api.post('/registro_cliente_vendedor',auth.auth, vendedorController.registro_cliente_vendedor);
api.get('/obtener_cliente_vendedor/:id',auth.auth,vendedorController.obtener_cliente_vendedor);
api.put('/actualizar_cliente_vendedor/:id',auth.auth, vendedorController.actualizar_cliente_vendedor);
api.delete('/eliminar_cliente_vendedor/:id',auth.auth, vendedorController.eliminar_cliente_vendedor);

api.get('/listar_clientes_filtro_vendedor/:tipo/:filtro?',auth.auth, vendedorController.listar_clientes_filtro_vendedor);
module.exports = api;