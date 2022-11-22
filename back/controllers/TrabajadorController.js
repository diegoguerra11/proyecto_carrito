'use strict'

let Trabajador = require('../models/trabajador');
let bcrypt = require('bcrypt-nodejs');

const listar_trabajadores_filtro_admin= async function (req, res) {
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}

    let tipo = req.params['tipo'];
    let filtro = req.params['filtro'];
    let buscar_trabajadores;

    let search_rol = req.user.role == 'superAdmin' ? {$in: ['vendedor', 'admin']} : 'vendedor'

    switch(tipo) {
        case 'apellidos': 
            buscar_trabajadores = Promise.resolve(Trabajador.find({apellidos:new RegExp(filtro, 'i'), rol: search_rol}));
            buscar_trabajadores.then(reg => {res.status(200).send({data:reg});})
            break;
        case 'correo':  
            buscar_trabajadores = Promise.resolve(Trabajador.find({email:new RegExp(filtro, 'i'), rol: search_rol}));
            buscar_trabajadores.then(reg => {res.status(200).send({data:reg});})
            break;
        default: 
            buscar_trabajadores = Promise.resolve(Trabajador.find({rol: search_rol}));
            buscar_trabajadores.then(reg => {res.status(200).send({data:reg});})
            break;
    }
}

const registrar_trabajador_admin = async function(req, res) {
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}

    let data = req.body;

    try {
        let validacion = await validaciones_trabajador(data.email, data.dni, null);
        if(validacion) {return res.status(200).send({message: validacion});}

        bcrypt.hash(data.password,null,null, async function(err,hash){
            if(!hash){return res.status(500).send({message:'ErrorServer', data:undefined});}
            data.password = hash;
            let crear_trabajador = Promise.resolve(Trabajador.create(data));
            crear_trabajador.then(reg => {
                res.status(200).send({data: reg});
            })
            .catch((ex) => {throw ex});
        });
    } catch(ex) {
        res.status(500).send({data: undefined, message: 'Error server'});
    }
}   

const obtener_trabajador_admin = async function(req, res) {
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    try {
        let buscar_trabajador = Promise.resolve(Trabajador.findById({_id: id}));

        buscar_trabajador.then(trabajador => {
            res.status(200).send({data: trabajador});
        });

    }catch(error){
        res.status(200).send({data:undefined, message:'Error en el servidor'});
    }
}

const actualizar_trabajador_admin = async function(req, res) {
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];
    let data = req.body;

    try {
        let validacion = await validaciones_trabajador(data.email, data.dni, id);
        if(validacion) {return res.status(200).send({message: validacion});}

        bcrypt.hash(data.password,null,null, async function(err,hash){
            if(!hash){return res.status(500).send({message:'ErrorServer', data:undefined});}
            if(data.password){data.password = hash;}
            let actualizar_trabajador = Promise.resolve(Trabajador.findByIdAndUpdate({_id: id}, data));
            actualizar_trabajador.then(
                trabajador => {
                    res.status(200).send({data:trabajador});
                } 
            )
            .catch((ex) => {throw ex});
        });
    }catch(error){
        res.status(200).send({data:undefined, message:'Error en el servidor'});
    }
}

const actualizar_contraseña_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}
     
    let id = req.params['id'];
    let data = req.body;
    
    try {
        let validacion = await validaciones_trabajador(data.password, id);
        if(validacion) {return res.status(200).send({message: validacion});}

        let actualizar_trabajador = Promise.resolve(Trabajador.findByIdAndUpdate({_id: id}, data));
        
        actualizar_trabajador.then(
            trabajador => {
                res.status(200).send({data:trabajador});
            } 
        )
    }catch(error){
        res.status(200).send({data:undefined, message:'Error en el servidor'});
    }
}

const desactivar_trabajador_admin = async function(req, res) {
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    try {
        let actualizar_trabajador = Promise.resolve(Trabajador.findByIdAndUpdate({_id: id}, {estado: false}));

        actualizar_trabajador.then(
            trabajador => {
                res.status(200).send({data:trabajador});
            } 
        )
    }catch(error){
        res.status(200).send({data:undefined, message:'Error en el servidor'});
    }
}

const activar_trabajador_admin = async function(req,res) {
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    try {
        let actualizar_trabajador = Promise.resolve(Trabajador.findByIdAndUpdate({_id: id}, {estado: true}));

        actualizar_trabajador.then(
            trabajador => {
                res.status(200).send({data:trabajador});
            } 
        )
    }catch(error){
        res.status(200).send({data:undefined, message:'Error en el servidor'});
    }
}

const validaciones_trabajador = async function(email, dni, id) {
    let existe_numero_documento = await Trabajador.exists({dni: dni, _id: {$ne: id}})

    if(existe_numero_documento) {return 'El numero de documento ya se encuentra en la base de datos';}

    let existe_correo_electronico = await Trabajador.exists({email: email, _id: {$ne: id}});
    if(existe_correo_electronico) {return 'El correo electronico ya se encuentra en la base de datos';}

    return null;
}

module.exports = {
    listar_trabajadores_filtro_admin,
    registrar_trabajador_admin,
    obtener_trabajador_admin,
    actualizar_trabajador_admin,
    actualizar_contraseña_admin,
    desactivar_trabajador_admin,
    activar_trabajador_admin
}