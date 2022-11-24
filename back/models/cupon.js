'use strict'

//Modelo de cupón.
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CuponSchema = Schema({
    codigo: {type: String, required: true},
    tipo: {type: String, required: true}, //Porcentaje | Precio fijo
    valor: {type: Number, required: true},
    limite: {type: Number, required: true},
    estado: {type: Boolean, default:true, required:true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('cupon',CuponSchema);