'use strict'

//Declaración de variables.
let Producto = require('../models/producto');
let Inventario = require('../models/inventario');
let Trabajador = require('../models/trabajador');
let Variedad = require('../models/Variedad');
let fs = require('fs');
let path = require('path');

//Función para registrar un producto en admin. El administrador podrá registrar un producto en el inventario de la tienda, incluyendo una imagen referencial.
const registro_producto_admin = async function (req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});} 
    let data = req.body;
            
    let img_path = req.files.portada.path;
    let name = img_path.split('\\');
    let portada_name = name [2];

    data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    data.portada = portada_name;
    let crear_producto = Promise.resolve(Producto.create(data));

    crear_producto.then(reg => {
        res.status(200).send({data:reg});
    });
}

//Función para listar productos en Admin. El administrador podrá listar los productos registrados en el sistema.
const listar_productos_admin = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    let filtro = req.params['filtro'];

    let reg = Promise.resolve(
        Producto.find({titulo: new RegExp(filtro, 'i')})
    );

    reg.then(data => 
        res.status(200).send({data: data})
    );
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
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
      
    let id = req.params['id'];

    try {
        let reg = Promise.resolve(Producto.findById({_id:id}));
        
        reg.then(data => 
            res.status(200).send({data: data})
        );
    } catch (error) {
        res.status(200).send({message:'No se encontró el producto', data:undefined});
    }
}

//Función para modificar un producto en Admin. El administrador podrá modificar los datos de un producto. Si tiene una imagen, actualiza los datos incluyendo la imagen. De lo contrario,
//actualiza solo los datos.
const actualizar_producto_admin = async function (req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];
    let data = req.body;
    let reg;
    if (req.files) {
        //SI HAY IMAGEN
        let img_path = req.files.portada.path;
        let name = img_path.split('\\');
        let portada_name = name [2];

        
        reg = Promise.resolve(Producto.findByIdAndUpdate({_id:id},{
            titulo: data.titulo,
            precio: data.precio,
            categoria: data.categoria,
            descripcion: data.descripcion,
            contenido:data.contenido,
            portada: portada_name
        }));

        reg.then(prod =>{          
            fs.stat('./uploads/productos/'+prod.portada, function(err){
                if (!err) {
                    fs.unlink('./uploads/productos/'+prod.portada, (error) => {
                        if (error) throw error;
                    });
                }
            }
            );
            res.status(200).send({data:prod});
        });
         
    }else{
        //No HAY IMAGEN
        reg = Promise.resolve(Producto.findByIdAndUpdate({_id:id},{
            titulo: data.titulo,
            stock: data.stock,
            precio: data.precio,
            categoria: data.categoria,
            descripcion: data.descripcion,
            contenido:data.contenido,
        }));
        reg.then(prod => res.status(200).send({data:prod}));
    }
   
}

//Función para eliminar un producto en admin. El administrador podrá eliminar un producto de la lista de productos.
const eliminar_producto_admin = async function (req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
     
    let id = req.params['id'];

    let buscar_producto = Promise.resolve(Producto.findByIdAndRemove({_id:id}));

    buscar_producto.then(reg => {
        res.status(200).send({data:reg});
    });
}

//Función para listar el inventario de productos en Admin. El administrador podrá listar el inventario con los productos registrados en el sistema.
const listar_inventario_producto_admin = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
      
    let id = req.params['id'];

    let buscar_inventario = Promise.resolve(Inventario.find({producto: id}).sort({createdAt: -1}));

    buscar_inventario.then(reg => {
        res.status(200).send({data:reg});
    })
}

//Función para eliminar inventario en Admin. El administrador podrá eliminar el inventario registrado, modificando y recalculando el nuevo stock en el sistema.
const eliminar_inventario_producto_admin = async function (req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    //OBTENER ID DEL INVENTARIO
    let id = req.params['id'];

    //ELIMINAR INVENTARIO
    let eliminar_inventario = Promise.resolve(Inventario.findByIdAndRemove({_id:id}));

    eliminar_inventario.then(reg => {
        //OBTENER EL REGISTRO DEL PRODUCTO
        let buscar_prod = Promise.resolve(Producto.findById({_id:reg.producto}));

        buscar_prod.then(prod => {
            //CALCULAR EL NUEVO STOCK
            let nuevo_stock = parseInt(prod.stock) - parseInt(reg.cantidad);

            //ACTUALIZACION DEL NUEVO STOCK AL PRODUCTO
            let actualizar_producto = Promise.resolve(Producto.findByIdAndUpdate({_id:reg.producto},{
                stock: nuevo_stock
            }))

            actualizar_producto.then(producto => {
                res.status(200).send({data:producto});
            });
        });
    });
}

//Función para registrar un inventario en Admin. El administrador podrá registrar un nuevo intentario en el sistema.
const registro_inventario_producto_admin = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;

    let crear_inventario = Promise.resolve(Inventario.create(data));

    crear_inventario.then(reg => {
        let buscar_variedad = Promise.resolve(Variedad.findOne({
            producto: data.producto,
            valor: data.variedad
        }));

        buscar_variedad.then((variedad) => {
            let actualizar_variedad = Promise.resolve(Variedad.findByIdAndUpdate({_id: variedad._id}, {
                stock: variedad.stock + data.cantidad
            }));
            
            actualizar_variedad.then(() => {
                res.status(200).send({data:reg});
            });
        });
    });
}

const actualizar_producto_variedades_admin = async function (req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = req.body;

    let buscar_producto = Promise.resolve(Producto.findByIdAndUpdate({_id:id},{
        titulo_variedad: data.titulo_variedad,
        variedades: data.variedades
    }));

    buscar_producto.then(reg => {
        res.status(200).send({data:reg});
    });
}

//Función para agregar una imagen a la galería en Admin. El administrador podrá agregar una imagen a la galería de imágenes registradas.
const agregar_imagen_galeria_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = req.body;

    let img_path = req.files.imagen.path;
    let name = img_path.split('\\');
    let imagen_name = name[2];

    let actualiza_producto = Promise.resolve(Producto.findByIdAndUpdate({_id:id},{ $push: {galeria:{
        imagen: imagen_name,
        _id: data._id
    }}}));

    actualiza_producto.then(reg => {
        res.status(200).send({data:reg});
    })

}

//Función para eliminar una imagen de la galería en Admin. El administrador podrá eliminar una imagen registrada en la galería.
const eliminar_imagen_galeria_admin = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];
    let data = req.body;

    let buscar_producto = Promise.resolve(Producto.findByIdAndUpdate({_id:id},{$pull: {galeria: {_id: data._id}}}));

    buscar_producto.then(reg => {
        res.status(200).send({data:reg});
    })
}



//---METODOS PUBLICOS---------------------------

//Función para listar los productos en un ámbito público. Se mostrarán los productos en estado 'Publicado'.
const listar_productos_publico = async function(req,res){
    let filtro = req.params['filtro'];

    let buscar_productos = Promise.resolve(Producto.find({estado: "Publicado",titulo: new RegExp(filtro, 'i')}).sort({createdAt:-1}));

    buscar_productos.then(reg => {
        res.status(200).send({data: reg});

    });
}

//Función para obtener el slug público de los productos. Los productos se mostrarán en un slug público en una url agradable al públic en general.
const obtener_productos_slug_publico = async function(req,res){
    let slug = req.params['slug'];

    let buscar_producto = Promise.resolve(Producto.findOne({slug: slug}));
    buscar_producto.then(reg => {
        res.status(200).send({data: reg});
    })

}

//Función para listar los productos recomendados. Se listarán los productos que la tienda considere como recomendados. 
const listar_productos_recomendados_publico = async function(req,res){
    let categoria = req.params['categoria'];

    let buscar_prod = Promise.resolve(Producto.find({categoria: categoria}).sort({createdAt:-1}).limit(8));
    buscar_prod.then(reg => {
        res.status(200).send({data: reg});
    });
}
const listar_productos_nuevos_publico = async function(req,res){
    let filtro = req.params['filtro'];
    let buscar_productos = Promise.resolve(Producto.find({estado: "Publicado",titulo: new RegExp(filtro, 'i')}).sort({createdAt:-1}).limit(8));

    buscar_productos.then(reg => {
        res.status(200).send({data: reg});

    });
}
const listar_productos_masvendidos_publico = async function(req,res){
    let filtro = req.params['filtro'];
    let buscar_productos = Promise.resolve(Producto.find({estado: "Publicado",titulo: new RegExp(filtro, 'i')}).sort({nventas:-1}).limit(8));

    buscar_productos.then(reg => {
        res.status(200).send({data: reg});

    });
}


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
    listar_productos_nuevos_publico,
    listar_productos_masvendidos_publico
}