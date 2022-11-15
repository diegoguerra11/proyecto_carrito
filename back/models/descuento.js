'use strict'

//Modelo de descuento.
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DescuentoSchema = Schema({
    titulo: {type: String, required: true},
    banner: {type: String, required: true},
    descuento: {type: Number, required: true},
    fecha_inicio: {type: String, required: true},
    fecha_fin: {type: String, required: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('descuento',DescuentoSchema);