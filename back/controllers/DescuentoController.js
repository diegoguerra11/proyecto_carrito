//Declaración de variables.
let Descuento = require('../models/descuento');
let fs = require('fs');
let path = require('path');

//Función para el registro de descuentos en Admin. El administrador podrá registrar un descuento a un producto para que sea visto en la página y el catálogo de la tienda.
const registro_descuento_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}

    let data = req.body;
            
    let img_path = req.files.banner.path;
    let name = img_path.split('\\');
    let banner_name = name[2];

    data.banner = banner_name;
    let crear_descuento = Promise.resolve(Descuento.create(data));

    crear_descuento.then(reg => {
        res.status(200).send({data:reg});
    });
}

//Función para listar los descuentos registrados en Admin. El administrador podrá listar los descuentos registrados en la tienda.
const listar_descuentos_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return   res.status(500).send({message: 'NoAccess'});}
     
    let filtro = req.params['filtro'];

    let buscar_descuentos = Promise.resolve(Descuento.find({titulo: new RegExp(filtro, 'i')}).sort({createdAt:-1}));

    buscar_descuentos.then(reg => {
        res.status(200).send({data: reg});
    });
}

//Función para obtener el banner de descuento. En la vista del producto, el sistema podrá incorporar un banner indicando que el producto se encuentra con descuento.
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

//Función para obtener el descuento en Admin. El administrador podrá buscar un descuento por su id.
const obtener_descuento_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    try {
        let buscar_descuento = Promise.resolve(Descuento.findById({_id:id}));
        buscar_descuento.then(reg => {
            res.status(200).send({data:reg});
        })
        .catch(()=> {throw error});
    } catch (error) {
        res.status(200).send({data:undefined});
    }
}

//Función para actualizar un descuento en Admin. El administrador podrá actualizar un descuento. Si el descuento tiene una imagen donde se indique el descuento, se actualizarán
//los datos del descuento con la imagen del banner. De lo contrario, solo se actualizarán los datos.
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

        reg = Promise.resolve(Descuento.findByIdAndUpdate({_id:id},{
            titulo: data.titulo,
            descuento: data.descuento,
            fecha_inicio: data.fecha_inicio,
            fecha_fin: data.fecha_fin,
            banner: banner_name
        }));

        fs.stat('./uploads/descuentos/'+reg.banner, function(err){
            if(!err){
                fs.unlink('./uploads/descuentos/'+reg.banner, (error)=>{
                    if(error) throw error;
                });
            }
        })

        res.status(200).send({data:reg});
    }else{
        //NO HAY IMAGEN
        reg = Promise.resolve(Descuento.findByIdAndUpdate({_id:id},{
            titulo: data.titulo,
            descuento: data.descuento,
            fecha_inicio: data.fecha_inicio,
            fecha_fin: data.fecha_fin,
        }));
    }

    res.status(200).send({data:reg});
}

//Función para eliminar un descuento en Admin. El administrador podrá eliminar un descuento de la lista de descuentos.
const eliminar_descuento_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];

    let buscar_descuento = Promise.resolve(Descuento.findByIdAndRemove({_id:id}));
    buscar_descuento.then(reg => {
        res.status(200).send({data:reg});
    });
}

//Función para obtener un descuento activo. Este descuento se podrá obtener de acuerdo al plazo en el que se encuentren los descuentos. Si un descuento termina, se elimina de la lista y
//el segundo descuento más reciente en vigencia pasa a ser el último.
const obtener_descuento_activo = async function(req,res){
    let buscar_descuentos = Promise.resolve(Descuento.find().sort({createdAt:-1}));
    
    buscar_descuentos.then(descuentos => {
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
    })
}

//Exportación de las funciones.
module.exports = {
    registro_descuento_admin,
    listar_descuentos_admin,
    obtener_banner_descuento,
    obtener_descuento_admin,
    actualizar_descuento_admin,
    eliminar_descuento_admin,
    obtener_descuento_activo
}