'use strict'

let express = require ('express');
let cuponController = require('../controllers/cuponController');

let api = express.Router();
let auth = require('../middlewares/authenticate');

//Crud cupón
api.post('/registro_cupon_admin', auth.auth, cuponController.registro_cupon_admin);
api.get('/listar_cupones_admin/:filtro?', auth.auth, cuponController.listar_cupones_admin);
api.get('/obtener_cupon_admin/:id',auth.auth,cuponController.obtener_cupon_admin);
api.put('/actualizar_cupon_admin/:id', auth.auth, cuponController.actualizar_cupon_admin);
api.get('/validar_cupon_admin/:cupon', auth.auth, cuponController.validar_cupon_admin);
api.get('/disminuir_cupon/:cupon', auth.auth, cuponController.disminuir_cupon);
api.delete('/eliminar_cupon_admin/:id',auth.auth, cuponController.eliminar_cupon_admin);

module.exports = api;