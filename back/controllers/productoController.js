'use strict'

let Producto = require('../models/producto');
let Inventario = require('../models/inventario');
let Trabajador = require('../models/trabajador');
let Variedad = require('../models/Variedad');
let fs = require('fs');
let path = require('path');


const registro_producto_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});} 
    let data = req.body;
            
    let img_path = req.files.portada.path;
    let name = img_path.split('\\');
    let portada_name = name [2];

    data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    data.portada = portada_name;
    let crear_producto = Promise.resolve(Producto.create(data));

    crear_producto.then(reg => {
        let crear_inventario = Promise.resolve(Inventario.create({
            admin: req.user.sub,
            cantidad: data.stock,
            proveedor: 'Primer registro',
            producto: reg._id
        }));
        crear_inventario.then(inventario => {
            res.status(200).send({data:reg, inventario: inventario});
        })
    });
}

const listar_productos_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    let filtro = req.params['filtro'];

    let reg = Promise.resolve(
        Producto.find({titulo: new RegExp(filtro, 'i')})
    );

    reg.then(data => 
        res.status(200).send({data: data})
    );
}

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

const obtener_producto_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}
      
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

        
        reg = Promise.resolve(Producto.findByIdAndUpdate({_id:id},{
            titulo: data.titulo,
            stock: data.stock,
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

const eliminar_producto_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
     
    let id = req.params['id'];

    let buscar_producto = Promise.resolve(Producto.findByIdAndRemove({_id:id}));

    buscar_producto.then(reg => {
        res.status(200).send({data:reg});
    });
}

const listar_inventario_producto_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
      
    let id = req.params['id'];

    let buscar_inventario = Promise.resolve(Inventario.find({producto: id}).sort({createdAt: -1}));

    buscar_inventario.then(reg => {
        res.status(200).send({data:reg});
    })
}

const eliminar_inventario_producto_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
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

const registro_inventario_producto_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;

    let buscar_trabajador = Promise.resolve(Trabajador.findById({_id: data.trabajador}));

    buscar_trabajador.then(
        admin => {
            data.trabajador = admin.nombres+' '+admin.apellidos;
            let actualizar_variedad = Promise.resolve(actualizar_variedad_admin(data.producto, data.variedad, data.cantidad))
            actualizar_variedad.then(
                () => {
                    let crear_inventario = Promise.resolve(Inventario.create(data));
            
                    crear_inventario.then(reg => {
                        res.status(200).send({data:reg});
                    });
                }
            );
            
        }
    )  
}

const actualizar_variedad_admin = async function(producto, valor, cantidad) {
    let buscar_variedad = Promise.resolve(Variedad.findOne({producto: producto, valor: valor}));

    buscar_variedad.then(
        variedad => {
            let actualizar_variedad = Promise.resolve(Variedad.findByIdAndUpdate({_id: variedad._id}, {stock: cantidad + variedad.stock}));
        }
    )
}

const actualizar_producto_variedades_admin = async function (req,res){
    if(!req.user || req.user.rol != 'admin'){return res.status(500).send({message: 'NoAccess'});}
    
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

const agregar_imagen_galeria_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}
    
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

const eliminar_imagen_galeria_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];
    let data = req.body;

    let buscar_producto = Promise.resolve(Producto.findByIdAndUpdate({_id:id},{$pull: {galeria: {_id: data._id}}}));

    buscar_producto.then(reg => {
        res.status(200).send({data:reg});
    })
}

//---METODOS PUBLICOS---------------------------
const listar_productos_publico = async function(req,res){
    let filtro = req.params['filtro'];

    let buscar_productos = Promise.resolve(Producto.find({estado: "Publicado",titulo: new RegExp(filtro, 'i')}).sort({createdAt:-1}));

    buscar_productos.then(reg => {
        res.status(200).send({data: reg});

    });
}

const obtener_productos_slug_publico = async function(req,res){
    let slug = req.params['slug'];

    let buscar_producto = Promise.resolve(Producto.findOne({slug: slug}));
    buscar_producto.then(reg => {
        res.status(200).send({data: reg});
    })

}

const listar_productos_recomendados_publico = async function(req,res){
    let categoria = req.params['categoria'];

    let buscar_prod = Promise.resolve(Producto.find({categoria: categoria}).sort({createdAt:-1}).limit(8));
    buscar_prod.then(reg => {
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
}