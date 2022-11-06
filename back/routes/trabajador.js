let express = require ('express');
let trabajadorController = require('../controllers/TrabajadorController');

let api = express.Router();
let auth = require('../middlewares/authenticate');

api.get('/listar_trabajadores_filtro_admin/:tipo/:filtro?', auth.auth, trabajadorController.listar_trabajadores_filtro_admin);
api.post('/registrar_trabajador_admin', auth.auth, trabajadorController.registrar_trabajador_admin);

module.exports = api;