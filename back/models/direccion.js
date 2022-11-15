'use strict'

//Modelo de dirección.
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DireccionSchema = Schema({
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    destinatario: {type: String, required: true},
    numeroDocumento: {type: String, required: true},
    tipoDocumento: {type: String, required: true},
    zip: {type: String, required: true},
    direccion: {type: String, required: true},
    pais: {type: String, required: true},
    region: {type: String, required: false},
    provincia: {type: String, required: false},
    distrito: {type: String, required: false},
    telefono: {type: String, required: true},
    principal: {type: Boolean, required: true},
    createdAt: {type:Date, default: Date.now, required: true}
});

module.exports =  mongoose.model('direccion',DireccionSchema);