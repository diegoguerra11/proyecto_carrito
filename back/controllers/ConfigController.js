let Config = require('../models/config');
let fs = require('fs');
let path = require('path');
let config = require('../global');

const obtener_config_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}

    let buscar_config = Promise.resolve(Config.findById({_id: config.config_id}));
    
    buscar_config.then(reg => {
        res.status(200).send({data:reg});
    })

}

const actualizar_config_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    
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

        buscar_config.then(conf => {
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

const obtener_config_publico  = async function(req,res){
    let buscar_config = Promise.resolve(Config.findById({_id: config.config_id}));

    buscar_config.then(reg => {
        res.status(200).send({data:reg});
    })
}

module.exports = {
    actualizar_config_admin,
    obtener_config_admin,
    obtener_logo,
    obtener_config_publico
}