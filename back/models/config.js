'use strict'

//Modelo de configuración.
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ConfigSchema = Schema({
    categorias: [{type: Object, required: true}],
    titulo: {type: String, required: true},
    logo: {type: String, required: true},
    serie: {type: String, required: true},
    correlativo: {type: String, required: true},

});

module.exports =  mongoose.model('config',ConfigSchema);