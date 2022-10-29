let Descuento = require('../models/descuento');
let fs = require('fs');
let path = require('path');

const registro_descuento_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}

    let data = req.body;
            
    let img_path = req.files.banner.path;
    let name = img_path.split('\\');
    let banner_name = name[2];

    data.banner = banner_name;
    let reg = await Descuento.create(data);

    res.status(200).send({data:reg});
}

const listar_descuentos_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return   res.status(500).send({message: 'NoAccess'});}
     
    let filtro = req.params['filtro'];

    let reg = await Descuento.find({titulo: new RegExp(filtro, 'i')}).sort({createdAt:-1});
    res.status(200).send({data: reg});
}

const obtener_banner_descuento = async function(req,res){
    let img = req.params['img'];
    let path_img;

    fs.stat('./uploads/descuentos/'+img, function(err){
        if(!err){
            path_img = './uploads/descuentos/'+img;
        }else{
            path_img = './uploads/default.jpg';
        }

        res.status(200).sendFile(path.resolve(path_img));
    })
}

const obtener_descuento_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    try {
        let reg = await Descuento.findById({_id:id});
        res.status(200).send({data:reg});
    } catch (error) {
        res.status(200).send({data:undefined});
    }
}


const actualizar_descuento_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin'){return  res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];
    let data = req.body;
    let reg;

    if(req.files){
        //SI HAY IMAGEN
        let img_path = req.files.banner.path;
        let name = img_path.split('\\');
        let banner_name = name[2];

        reg = await Descuento.findByIdAndUpdate({_id:id},{
            titulo: data.titulo,
            descuento: data.descuento,
            fecha_inicio: data.fecha_inicio,
            fecha_fin: data.fecha_fin,
            banner: banner_name
        });

        fs.stat('./uploads/descuentos/'+reg.banner, function(err){
            if(!err){
                fs.unlink('./uploads/descuentos/'+reg.banner, (err)=>{
                    if(err) throw err;
                });
            }
        })

        res.status(200).send({data:reg});
    }else{
        //NO HAY IMAGEN
        reg = await Descuento.findByIdAndUpdate({_id:id},{
            titulo: data.titulo,
            descuento: data.descuento,
            fecha_inicio: data.fecha_inicio,
            fecha_fin: data.fecha_fin,
        });
    }

    res.status(200).send({data:reg});
}

const eliminar_descuento_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];

    let reg = await Descuento.findByIdAndRemove({_id:id});
    res.status(200).send({data:reg});
}

const obtener_descuento_activo = async function(req,res){
    let descuentos = await Descuento.find().sort({createdAt:-1});
    let arr_descuentos = [];
    let today = Date.parse(new Date().toString())/1000;
   
    descuentos.forEach(element => {
        let tt_inicio = Date.parse(element.fecha_inicio+"T00:00:00")/1000;
        let tt_fin = Date.parse(element.fecha_fin+"T23:59:59")/1000;

        if(today >= tt_inicio && today <= tt_fin){
            arr_descuentos.push(element);
        }
    });

    if(arr_descuentos.length < 1) {return res.status(200).send({data:undefined});}
    
    res.status(200).send({data:arr_descuentos});
}

module.exports = {
    registro_descuento_admin,
    listar_descuentos_admin,
    obtener_banner_descuento,
    obtener_descuento_admin,
    actualizar_descuento_admin,
    eliminar_descuento_admin,
    obtener_descuento_activo
}