'use strict'

let Admin = require('../models/admin');
let bcrypt = require('bcrypt-nodejs');

const listar_trabajadores_filtro_admin = async function (req, res) {
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}

    let tipo = req.params['tipo'];
    let filtro = req.params['filtro'];
    let reg;

    switch(tipo) {
        case 'apellidos': reg = await Admin.find({apellidos:new RegExp(filtro, 'i'), rol:'vendedor'});
            break;
        case 'correo': reg = await Admin.find({email:new RegExp(filtro, 'i'), rol:'vendedor'});
            break;
        default: reg = await Admin.find({rol:'vendedor'});
            break;
    }

    res.status(200).send({data:reg});
}

const registrar_trabajador_admin = async function(req, res) {
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}

    let data = req.body;

    try {
        bcrypt.hash('Contra123',null,null, async function(err,hash){
            if(!hash){return res.status(500).send({message:'ErrorServer', data:undefined});}
            data.password = hash;
            data.rol = 'vendedor';
            let crear_trabajador = Promise.resolve(Admin.create(data));
            crear_trabajador.then(reg => {
                res.status(200).send({data: reg});
            })
            .catch(() => {throw ex});
        });
    } catch(ex) {
        res.status(500).send({data: undefined, message: 'Error server'});
    }
}   

const obtener_trabajador_admin = async function(req, res) {
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    try {
        let buscar_trabajador = Promise.resolve(Admin.findById({_id: id}));

        buscar_trabajador.then(trabajador => {
            res.status(200).send({data: trabajador});
        });

    }catch(error){
        res.status(200).send({data:undefined, message:'Error en el servidor'});
    }
}

const actualizar_trabajador_admin = async function(req, res) {
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];
    let data = req.body;

    try {
        let actualizar_trabajador = Promise.resolve(Admin.findByIdAndUpdate({_id: id}, data));

        actualizar_trabajador.then(
            trabajador => {
                res.status(200).send({data:trabajador});
            } 
        )
    }catch(error){
        res.status(200).send({data:undefined, message:'Error en el servidor'});
    }
}

module.exports = {
    listar_trabajadores_filtro_admin,
    registrar_trabajador_admin,
    obtener_trabajador_admin,
    actualizar_trabajador_admin
}