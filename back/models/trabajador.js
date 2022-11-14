'use strict'

//Modelo de admin.
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AdminSchema = Schema({
    nombres: {type: String, required: true},
    apellidos: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    telefono: {type: String, required: true},
    rol: {type: String, required: true},
    dni: {type: String, required: true},
    tipoDocumento: {type: String, required: true},
    estado: {type: Boolean, default:true, required:true}
});

module.exports =  mongoose.model('trabajador',AdminSchema);