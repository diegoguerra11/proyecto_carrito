'use strict'

//Modelo de inventario.
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let InventarioSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    variedad: {type: String, required: true},
    cantidad: {type: Number, require: true},
    trabajador: {type: String, required: true},
    proveedor: {type: String, require: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('inventario',InventarioSchema);