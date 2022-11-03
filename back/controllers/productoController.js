'use strict'

//Declaración de variables.
let Producto = require('../models/producto');
let Inventario = require('../models/inventario');
let fs = require('fs');
let path = require('path');

//Función para registrar un producto en admin. El administrador podrá registrar un producto en el inventario de la tienda, incluyendo una imagen referencial.
const registro_producto_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});} 
    let data = req.body;
            
    let img_path = req.files.portada.path;
    let name = img_path.split('\\');
    let portada_name = name [2];

    data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    data.portada = portada_name;
    let reg = await Producto.create(data);

    let inventario = await Inventario.create({
        admin: req.user.sub,
        cantidad: data.stock,
        proveedor: 'Primer registro',
        producto: reg._id
    });

    res.status(200).send({data:reg, inventario: inventario});
}

//Función para listar productos en Admin. El administrador podrá listar los productos registrados en el sistema.
const listar_productos_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    let filtro = req.params['filtro'];

    let reg = await Producto.find({titulo: new RegExp(filtro, 'i')});
    res.status(200).send({data: reg});
}

//Función para obtener la portada de la imagen. Si el producto contiene una imagen, el sistema muestra dicha imagen. Por el contrario, muestra una imagen por defecto.
const obtener_portada = async function(req,res){
    let img = req.params['img'];

    fs.stat('./uploads/productos/'+img, function(err){
        if (!err) {
            let path_img = './uploads/productos/'+ img;
            res.status(200).sendFile(path.resolve(path_img));
        } else{
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

//Función para obtener un producto en Admin. El administrador puede obtener los detalles de un producto al buscarlo por su id.
const obtener_producto_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}
      
    let id = req.params['id'];

    try {
        let reg = await Producto.findById({_id:id});

        res.status(200).send({data:reg});
    } catch (error) {
        res.status(200).send({message:'No se encontró el producto', data:undefined});
    }
}

//Función para modificar un producto en Admin. El administrador podrá modificar los datos de un producto. Si tiene una imagen, actualiza los datos incluyendo la imagen. De lo contrario,
//actualiza solo los datos.
const actualizar_producto_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];
    let data = req.body;
    let reg;
    if (req.files) {
        //SI HAY IMAGEN
        let img_path = req.files.portada.path;
        let name = img_path.split('\\');
        let portada_name = name [2];

        
        reg = await Producto.findByIdAndUpdate({_id:id},{
            titulo: data.titulo,
            stock: data.stock,
            precio: data.precio,
            categoria: data.categoria,
            descripcion: data.descripcion,
            contenido:data.contenido,
            portada: portada_name
        });

        fs.stat('./uploads/productos/'+reg.portada, function(err){
            if (!err) {
                fs.unlink('./uploads/productos/'+reg.portada, (error) => {
                    if (error) throw error;
                });
            }
        })
       
    }else{
        //NO HAY IMAGEN
        reg = await Producto.findByIdAndUpdate({_id:id},{
            titulo: data.titulo,
            stock: data.stock,
            precio: data.precio,
            categoria: data.categoria,
            descripcion: data.descripcion,
            contenido:data.contenido,
        });
    }
    res.status(200).send({data:reg});
}

//Función para eliminar un producto en admin. El administrador podrá eliminar un producto de la lista de productos.
const eliminar_producto_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
     
    let id = req.params['id'];

    let reg = await Producto.findByIdAndRemove({_id:id});

    res.status(200).send({data:reg});
}

//Función para listar el inventario de productos en Admin. El administrador podrá listar el inventario con los productos registrados en el sistema.
const listar_inventario_producto_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
      
    let id = req.params['id'];

    let reg = await Inventario.find({producto: id}).populate('admin').sort({createdAt: -1});
    res.status(200).send({data:reg});
}

//Función para eliminar inventario en Admin. El administrador podrá eliminar el inventario registrado, modificando y recalculando el nuevo stock en el sistema.
const eliminar_inventario_producto_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    //OBTENER ID DEL INVENTARIO
    let id = req.params['id'];

    //ELIMINAR INVENTARIO
    let reg = await Inventario.findByIdAndRemove({_id:id});

    //OBTENER EL REGISTRO DEL PRODUCTO
    let prod = await Producto.findById({_id:reg.producto});

    //CALCULAR EL NUEVO STOCK
    let nuevo_stock = parseInt(prod.stock) - parseInt(reg.cantidad);

    //ACTUALIZACION DEL NUEVO STOCK AL PRODUCTO
    let producto = await Producto.findByIdAndUpdate({_id:reg.producto},{
        stock: nuevo_stock
    })

    res.status(200).send({data:producto});
}

//Función para registrar un inventario en Admin. El administrador podrá registrar un nuevo intentario en el sistema.
const registro_inventario_producto_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;

    let reg = await Inventario.create(data);

    res.status(200).send({data:reg});
}

//Función para actualizar los productos por variedad en Admin. El administrador podrá actualizar los títulos de los productos y las variedades existentes en la tienda.
const actualizar_producto_variedades_admin = async function (req,res){
    if(!req.user || req.user.rol != 'admin'){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = req.body;

    let reg = await Producto.findByIdAndUpdate({_id:id},{
        titulo_variedad: data.titulo_variedad,
        variedades: data.variedades
    });

    res.status(200).send({data:reg});
}

//Función para agregar una imagen a la galería en Admin. El administrador podrá agregar una imagen a la galería de imágenes registradas.
const agregar_imagen_galeria_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = req.body;

    let img_path = req.files.imagen.path;
    let name = img_path.split('\\');
    let imagen_name = name[2];

    let reg =await Producto.findByIdAndUpdate({_id:id},{ $push: {galeria:{
        imagen: imagen_name,
        _id: data._id
    }}});

    res.status(200).send({data:reg});
}

//Función para eliminar una imagen de la galería en Admin. El administrador podrá eliminar una imagen registrada en la galería.
const eliminar_imagen_galeria_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];
    let data = req.body;

    let reg =await Producto.findByIdAndUpdate({_id:id},{$pull: {galeria: {_id: data._id}}});
    res.status(200).send({data:reg});
}

//---METODOS PUBLICOS---------------------------

//Función para listar los productos en un ámbito público. Se mostrarán los productos en estado 'Publicado'.
const listar_productos_publico = async function(req,res){
    let filtro = req.params['filtro'];

    let reg = await Producto.find({estado: "Publicado",titulo: new RegExp(filtro, 'i')}).sort({createdAt:-1});
    res.status(200).send({data: reg});
}

//Función para obtener el slug público de los productos. Los productos se mostrarán en un slug público en una url agradable al públic en general.
const obtener_productos_slug_publico = async function(req,res){
    let slug = req.params['slug'];

    let reg = await Producto.findOne({slug: slug});
    res.status(200).send({data: reg});
}

//Función para listar los productos recomendados. Se listarán los productos que la tienda considere como recomendados. 
const listar_productos_recomendados_publico = async function(req,res){
    let categoria = req.params['categoria'];

    let reg = await Producto.find({categoria: categoria}).sort({createdAt:-1}).limit(8);
    res.status(200).send({data: reg});
}

//Exportación de las funciones.
module.exports = {
    registro_producto_admin,
    listar_productos_admin,
    obtener_portada,
    obtener_producto_admin,
    actualizar_producto_admin,
    eliminar_producto_admin,
    listar_inventario_producto_admin,
    eliminar_inventario_producto_admin,
    registro_inventario_producto_admin,
    actualizar_producto_variedades_admin,
    agregar_imagen_galeria_admin,
    eliminar_imagen_galeria_admin,
    listar_productos_publico,
    obtener_productos_slug_publico,
    listar_productos_recomendados_publico,
}