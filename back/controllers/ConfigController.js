
//Declaración de variables.
let Config = require('../models/config');
let fs = require('fs');
let path = require('path');
let config = require('../global');

//Función para obtener la configuración actual de la tienda en Admin. El administrador podrá establecer la configuración que desee.
const obtener_config_admin = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}

    let buscar_config = Promise.resolve(Config.findById({_id: config.config_id}));
    
    buscar_config.then(reg => {
        res.status(200).send({data:reg});
    })

}

//Función para modificar la configuración de la tienda en Admin. El administrador podrá agregar diversas configuraciones como nuevas columnas, cambio del logo de la tienda, entre otras.
const actualizar_config_admin = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;
    let reg;

    if (req.files) {
        let img_path = req.files.logo.path;
        let name = img_path.split('\\');
        let logo_name = name [2];

        reg = Promise.resolve(Config.findByIdAndUpdate({_id: config.config_id},{
            categorias: JSON.parse(data.categorias),
            titulo: data.titulo,
            serie: data.serie,
            logo: logo_name,
            correlativo: data.correlativo,
        }));

        reg.then(conf => {
            fs.stat('./uploads/configuraciones/'+conf.logo, function(err){
                if(!err){
                    fs.unlink('./uploads/configuraciones/'+conf.logo, (error)=>{
                        if(error) throw error;
                    });
                }
            }); 
        })

    } else {
        reg = Promise.resolve(Config.findByIdAndUpdate({_id: config.config_id},{
            categorias: data.categorias,
            titulo: data.titulo,
            serie: data.serie,
            correlativo: data.correlativo,
        }));
    } 

    res.status(200).send({data:reg});
}

//Función para obtener el logo de la tienda- El sistema extrae la imagen establecida para el logo de la tienda y la muestra en las interfaces de la tienda.
const obtener_logo = async function(req,res){
    let img = req.params['img'];
    let path_img;

    fs.stat('./uploads/configuraciones/'+img, function(err){
        if (!err) {
            path_img = './uploads/configuraciones/'+ img;
        } else{
            path_img = './uploads/default.jpg';
        }
        res.status(200).sendFile(path.resolve(path_img));
    });
}

//Función para obtener la configuración en un ámbito público. Esto se establecerá para la página principal y sus vistas principales.
const obtener_config_publico  = async function(req,res){
    let buscar_config = Promise.resolve(Config.findById({_id: config.config_id}));

    buscar_config.then(reg => {
        res.status(200).send({data:reg});
    })
}

//Exportación de las funciones.
module.exports = {
    actualizar_config_admin,
    obtener_config_admin,
    obtener_logo,
    obtener_config_publico
}
