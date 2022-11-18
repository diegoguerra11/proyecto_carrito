'use strict'

//Aquí se muestra la función que realiza las excepciones ocurridas en el servidor.

let bcrypt = require('bcrypt-nodejs');

let new_pass;

const encrypt = function(password, res) {
    bcrypt.hash(password, null, null, async function(err, hash) {
        if(!hash){return res.status(500).send({message: 'Error inesperado en el servidor'});}
        new_pass = hash;
    });
    
    return new_pass;
}

module.exports = {
    encrypt
}