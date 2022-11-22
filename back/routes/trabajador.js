let express = require ('express');
let trabajadorController = require('../controllers/TrabajadorController');

let api = express.Router();
let auth = require('../middlewares/authenticate');

api.get('/listar_trabajadores_filtro_admin/:tipo/:filtro?', auth.auth, trabajadorController.listar_trabajadores_filtro_admin);
api.get('/obtener_trabajador_admin/:id', auth.auth, trabajadorController.obtener_trabajador_admin);
api.post('/registrar_trabajador_admin', auth.auth, trabajadorController.registrar_trabajador_admin);
api.put('/actualizar_trabajador_admin/:id', auth.auth, trabajadorController.actualizar_trabajador_admin);
api.put('/actualizar_contraseña_admin/:id',auth.auth,trabajadorController.actualizar_contraseña_admin);
api.put('/desactivar_trabajador_admin/:id', auth.auth, trabajadorController.desactivar_trabajador_admin);
api.put('/activar_trabajador_admin/:id', auth.auth, trabajadorController.activar_trabajador_admin);


module.exports = api;