'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ClienteSchema = Schema({
    nombres: {type: String, required: true},
    apellidos: {type: String, required: true},
    pais: {type: String, required: false},
    email: {type: String, required: true},
    password: {type: String, required: true},
    perfil: {type: String,default: 'perfil.png', required: true},
    telefono: {type: String, required: false},
    genero: {type: String, required: false},
    f_nacimiento: {type: String, required: false},
    numeroDocumento: {type: String, required: false},
    tipoDocumento: {type: String, required: false},
    createdAt: {type:Date, default: Date.now, require:true}

});

module.exports = mongoose.model('cliente', ClienteSchema);