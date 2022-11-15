'use strict'

//Modelo de variedad.
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let VariedadSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    valor: {type: String, required: true},
    stock: {type: Number, default: 0, required: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('variedad',VariedadSchema);