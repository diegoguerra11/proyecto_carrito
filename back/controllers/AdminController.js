'use strict'

//Declaración de variables.
let Admin = require('../models/admin');
let Venta = require('../models/Venta');
let Variedad = require('../models/Variedad');
let Producto = require('../models/producto');
let Dventa = require('../models/Dventa');
let bcrypt = require('bcrypt-nodejs');
let jwt = require('../helpers/jwt');
let mail = require('../helpers/mail');

//Función para el registro de usuarios administradores. El registro requerirá un correo y una contraseña, los cuales serán necesarios para el inicio de sesión en el panel de Admin.
const registro_admin = async function(req, res){
    let data = req.body;

    let existe_correo = await Admin.exists({email: data.email});

    if(!data.password){return res.status(200).send({message:'El campo contraseña es obligatorio', data:undefined});}
    if(existe_correo){return res.status(200).send({message:'El correo ya existe en la base de datos', data:undefined});}

    bcrypt.hash(data.password,null,null, async function(err,hash){
        if(!hash){return res.status(500).send({message:'ErrorServer', data:undefined});}
        data.password = hash;
        let reg = await Admin.create(data);
        res.status(200).send({data:reg});
    });
}

//Inicio de sesión en panel de Admin. 
const login_admin = async function(req, res){
    let data = req.body;
    let admin_arr = [];


    admin_arr = await Admin.find({email:data.email});

    if(admin_arr.length == 0){return res.status(200).send({message: 'No se encontro el correo', data:undefined});}  
    
    //LOGIN
    let user = admin_arr[0];

    bcrypt.compare(data.password,user.password,async function(error, check){
        if(!check){return res.status(500).send({message: 'La contraseña no coincide', data: undefined});}

        res.status(200).send({
            data:user,
            token: jwt.createToken(user)
        });
    });
 } 

 //Función para solicitar el registro de ventas en Admin.
 const obtener_ventas_admin  = async function(req,res){

    //Restricción realizada a los usuarios: si no son usuarios con el rol de administrador, no podrán acceder a esta función.
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    
    let desde = req.params['desde'];
    let hasta = req.params['hasta'];
    
    let ventas = await Venta.find().populate('cliente').populate('direccion').sort({createdAt:-1});

    if(desde != 'undefined' && hasta != 'undefined'){
        let ventas_fecha = []
        let tt_desde = Date.parse(new Date(desde +'T00:00:00'))/1000;
        let tt_hasta = Date.parse(new Date(hasta +'T00:00:00'))/1000;

        for(let item of tem_ventas){
            let tt_created = Date.parse(new Date(item.createdAt))/1000;
             if(tt_created >= tt_desde && tt_created <= tt_hasta){
                ventas_fecha.push(item);
            }
        }

        return res.status(200).send({data: ventas_fecha});
    }

    res.status(200).send({data: ventas});
}

//Función para el listado de variedades en Admin. Se podrá listar las variedades por su id.
const listar_variedades_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = await Variedad.find({producto:id});
   
    res.status(200).send({data: data});
}

//Función para el listado de productos por variedades en Admin. Se podrá listar las variedades y los productos que tengan estas variedades.
const listar_variedades_productos_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});} 

    let productos = await Variedad.find().populate('producto');
    res.status(200).send({data: productos});
}

//Función para obtener los detalles de la orden realizada por el cliente. El cliente podrá ver los detalles de la orden realizada, tales como el monto a pagar y los productos especificados.
const obtener_detalles_ordenes_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    try {
        let venta = await Venta.findById({_id:id}).populate('direccion').populate('cliente');
        let detalles = await Dventa.find({venta: venta._id}).populate('producto').populate('variedad');
        res.status(200).send({data:venta, detalles:detalles});

    } catch (error) {
        res.status(200).send({message:'Error server', data:undefined});
    }
}

//Función para marcar una orden de pedido como 'Finalizado'. El usuario puede establecer su orden de pedido como finalizada cuando haya recibido el producto.
const marcar_finalizado_orden = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
   
    let id = req.params['id'];

    let venta = await Venta.findByIdAndUpdate({_id:id}, {
        estado: 'Finalizado'
    });

    res.status(200).send({data:venta});
}

//Función para eliminar una orden de pedido. El usuario puede eliminar una orden de pedido si ya no desea continuar con la compra.
const eliminar_orden_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];

    let venta = await Venta.findOneAndRemove({_id:id});

    await Dventa.remove({venta:id});

    res.status(200).send({data:venta});
}

//Función para marcar una orden de pedido como 'Enviado'. El usuario puede establecer la orden de pedido como 'Enviado' cuando el pedido haya sido enviado.
const marcar_envio_orden = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = req.body;

    let venta = await Venta.findByIdAndUpdate({_id:id},{
        tracking: data.tracking,
        estado: 'Enviado'
    });

    enviar_email(venta._id, 'confirmar_envio');

    res.status(200).send({data:venta});
}

//Función que confirma el pago de un cliente de su orden de pedido. El sistema actualizará los datos de los productos como el stock y las ventas realizadas.
const confirmar_pago_orden = async function(req,res) {
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let venta = await Venta.findByIdAndUpdate({_id:id},{
        estado: 'Procesando'
    });

    let detalles = await Dventa.find({venta:id});

    for(let element of detalles){
        let element_producto = await Producto.findById({_id:element.producto});
        let new_stock = element_producto.stock - element.cantidad;
        let new_ventas = element_producto.nventas + 1;

        let element_variedad = await Variedad.findById({_id:element.variedad});
        let new_stock_variedad = element_variedad.stock - element.cantidad;

        await Producto.findByIdAndUpdate({_id: element.producto},{
            stock: new_stock,
            nventas: new_ventas
        });

        await Variedad.findByIdAndUpdate({_id: element.variedad},{
            stock: new_stock_variedad,
        });
    }

    res.status(200).send({data:venta});
}

//Función para eliminar una variedad de la lista de variedades. El administrador podrá eliminar una variedad de producto.
const eliminar_variedad_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let reg = await Variedad.findByIdAndRemove({_id:id});
    res.status(200).send({data:reg});
}

//Función para agregar nueva variedad de producto. El administrador podrá agregar una nueva variedad de producto.
const agregar_nueva_variedad_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;
    let reg = await Variedad.create(data);

    res.status(200).send({data:reg});
}

//Función para modificar una variedad de producto. El administrador podrá modificar los datos de una variedad existente. 
const actualizar_producto_variedades_admin = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = req.body;

    let reg = await Producto.findByIdAndUpdate({_id:id},{
        titulo_variedad: data.titulo_variedad,
    });

    res.status(200).send({data:reg});
}

//Función para registrar una compra de manera manual por el cliente. El cliente podrá registrar un pedido que podrá pagar de manera física (pago contra entrega). A la vez, esta compra
//será registrada en el sistema.
const registro_compra_manual_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let data = req.body;
    let detalles = data.detalles;

        data.estado = 'Procesando';
        
        console.log(data);

        let venta = await Venta.create(data);

    for(let element of detalles){
        element.venta = venta._id;
        element.cliente = venta.cliente;
        await Dventa.create(element);

        let element_producto = await Producto.findById({_id:element.producto});
        let new_stock = element_producto.stock - element.cantidad;
        let new_ventas = element_producto.nventas + 1;

        let element_variedad = await Variedad.findById({_id:element.variedad});
        let new_stock_variedad = element_variedad.stock - element.cantidad;

        await Producto.findByIdAndUpdate({_id: element.producto},{
            stock: new_stock,
            nventas: new_ventas
        });

        await Variedad.findByIdAndUpdate({_id: element.variedad},{
            stock: new_stock_variedad,
        });
    }

    enviar_email(venta._id, 'confirmar_compra');

    res.status(200).send({venta:venta});
}

//Función para verificar si la cantidad de productos que el cliente desea comprar es manor o mayor al stock del producto. Si fuese mayor, el sistema no permitirá la compra de la cantidad
//indicada.
const pedido_compra_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    try {
        let data = req.body;
        let detalles = data.detalles;
        let access = false;
        let producto_sl = '';

        for(let item of detalles){
            let variedad = await Variedad.findById({_id:item.variedad}).populate('producto');
            if(variedad.stock < item.cantidad){
                access = true;
                producto_sl = variedad.producto.titulo;
            }
        }

        if(access) {return res.status(200).send({venta:undefined,message:'Stock insuficiente para ' + producto_sl});}
        
        data.estado = 'En espera';
        let venta = await Venta.create(data);

        for(let element of detalles){
            element.venta = venta._id;
            await Dventa.create(element);
            await Carrito.remove({cliente:data.cliente});
        }
        
        enviar_email(venta._id, 'confirmar_pedido');

        res.status(200).send({venta:venta});
    } catch (error) {
        res.status(200).send({message:'Error server', data:undefined});
    }
}

//Función para cambiar la visibilidad del producto en el catálogo de la tienda. Los productos que se encuentren como 'publicados' son los productos visibles en el catálogo virtual,
//mientras que los que se encuentren en 'edición' son aquellos que no están visibles en el catálogo.
const cambiar_vs_producto_admin = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let estado = req.params['estado'];
    
    try {
        switch(estado){
            case 'Edicion':
                await Producto.findByIdAndUpdate({_id:id},{estado:'Publicado'});
                break;
            case 'Publicado':
                await Producto.findByIdAndUpdate({_id:id},{estado:'Edicion'});
                break;
            }
            res.status(200).send({data:true});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }

//Función para que el cliente pueda registrar su email al momento de realizar su compra. El email servirá para recibir el comprobante con lso detalles de la compra.
const enviar_email = async function(venta, motivo) {
    let orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
    let dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');

    switch(motivo){
        case 'confirmar_pedido':
            mail.enviar_correo(
                orden, 
                dventa, 
                '/mails/email_pedido.html', 
                'Confirmación del pedido' + orden._id
            );
            break;
        case 'confirmar_envio':
            mail.enviar_correo(
                orden, 
                dventa, 
                '/mails/email_enviado.html', 
                'Tu pedido ' + orden._id + ' fué enviado'
            );
    
            break;
        case 'confirmar_compra':
            mail.enviar_correo(
                orden, 
                dventa, 
                '/mails/email_enviado.html', 
                'Confirmación de compra ' + orden._id
            );
            break;
    }
}

//Exportación de las funciones.
module.exports ={
    registro_admin,
    login_admin,
    obtener_ventas_admin,
    listar_variedades_admin,
    listar_variedades_productos_admin,
    confirmar_pago_orden,
    obtener_detalles_ordenes_cliente,
    marcar_envio_orden,
    eliminar_orden_admin,
    marcar_finalizado_orden,
    agregar_nueva_variedad_admin, 
    eliminar_variedad_admin,
    registro_compra_manual_cliente,
    actualizar_producto_variedades_admin,
    pedido_compra_cliente,
    cambiar_vs_producto_admin
}