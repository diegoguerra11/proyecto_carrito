let Config = require('../models/config');
let fs = require('fs');
let path = require('path');
let config = require('../global');


const obtener_config_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}

    let reg = await Config.findById({_id: config.config_id});
    
    res.status(200).send({data:reg});
}

const actualizar_config_admin = async function(req,res){
    if(!req.user || !req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;

    if (req.files) {
        console.log('Si hay img');
        let img_path = req.files.logo.path;
        let name = img_path.split('\\');
        let logo_name = name [2];

        let reg = await Config.findByIdAndUpdate({_id: config.config_id},{
            categorias: JSON.parse(data.categorias),
            titulo: data.titulo,
            serie: data.serie,
            logo: logo_name,
            correlativo: data.correlativo,
        });

        fs.stat('./uploads/configuraciones/'+reg.logo, function(err){
            if(!err){
                fs.unlink('./uploads/configuraciones/'+reg.logo, (err)=>{
                    if(err) throw err;
                });
            }
        })
        
        res.status(200).send({data:reg});

    } else {
        console.log('No hay img');
        let reg = await Config.findByIdAndUpdate({_id: config.config_id},{
            categorias: data.categorias,
            titulo: data.titulo,
            serie: data.serie,
            correlativo: data.correlativo,
        });

        res.status(200).send({data:reg});
    } 

}

const obtener_logo = async function(req,res){
    let img = req.params['img'];

    console.log(img);
    fs.stat('./uploads/configuraciones/'+img, function(err){
        if (!err) {
            let path_img = './uploads/configuraciones/'+ img;
            res.status(200).sendFile(path.resolve(path_img));
        } else{
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

const obtener_config_publico  = async function(req,res){
    let reg = await Config.findById({_id: config.config_id});
    res.status(200).send({data:reg});
}


module.exports = {
    actualizar_config_admin,
    obtener_config_admin,
    obtener_logo,
    obtener_config_publico
}