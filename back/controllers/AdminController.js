'use strict'

let Admin = require('../models/admin');
let Venta = require('../models/Venta');
let Variedad = require('../models/Variedad');
let Producto = require('../models/producto');
let Dventa = require('../models/Dventa');
let bcrypt = require('bcrypt-nodejs');
let jwt = require('../helpers/jwt');
let mail = require('../helpers/mail');

const registro_admin = async function(req, res){
    let data = req.body;

    if(!data.password){return res.status(200).send({message:'El campo contraseña es obligatorio', data:undefined});}

    let existe_correo = Promise.resolve(Admin.exists({email: data.email}));

    existe_correo.then(existe => {
        if(existe){return res.status(200).send({message:'El correo ya existe en la base de datos', data:undefined});}

        bcrypt.hash(data.password,null,null, async function(err,hash){
            if(!hash){return res.status(500).send({message:'ErrorServer', data:undefined});}
            data.password = hash;
            let reg = await Admin.create(data);
            res.status(200).send({data:reg});
        });
    });
}

const login_admin = async function(req, res){
    let data = req.body;

    let buscar_admin = Promise.resolve(Admin.findOne({email:data.email}));

    buscar_admin.then(admin => {
        if(!admin){return res.status(200).send({message: 'No se encontro el correo', data:undefined});}  

        bcrypt.compare(data.password, admin.password,async function(error, check){
            if(!check){return res.status(500).send({message: 'La contraseña no coincide', data: undefined});}

            res.status(200).send({
                data: admin,
                token: jwt.createToken(admin)
            });
        });
    });  
 } 

 const obtener_ventas_admin  = async function(req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    
    let desde = req.params['desde'];
    let hasta = req.params['hasta'];
    
    let buscar_ventas = Promise.resolve(Venta.find().populate('cliente').populate('direccion').sort({createdAt:-1}));

    buscar_ventas.then(ventas => {
        if(desde != 'undefined' && hasta != 'undefined'){
            let ventas_fecha = []
            let tt_desde = Date.parse(new Date(desde +'T00:00:00'))/1000;
            let tt_hasta = Date.parse(new Date(hasta +'T00:00:00'))/1000;
    
            for(let item of ventas){
                let tt_created = Date.parse(new Date(item.createdAt))/1000;
                 if(tt_created >= tt_desde && tt_created <= tt_hasta){
                    ventas_fecha.push(item);
                }
            }
    
            return res.status(200).send({data: ventas_fecha});
        }
    
        res.status(200).send({data: ventas});
    });
}

const listar_variedades_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let buscar_variedades = Promise.resolve(Variedad.find({producto:id}));

    buscar_variedades.then(data => {
        res.status(200).send({data: data});
    });
}

const listar_variedades_productos_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});} 

    let buscar_vars_prod = Promise.resolve( Variedad.find().populate('producto'));

    buscar_vars_prod.then(vars_prod => {
        res.status(200).send({data: vars_prod});
    });
}

//venta
const obtener_detalles_ordenes_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let buscar_venta = Promise.resolve(Venta.findById({_id:id}).populate('direccion').populate('cliente'));
        
    buscar_venta.then(venta => {
        let buscar_detalles = Promise.resolve(Dventa.find({venta: venta._id}).populate('producto').populate('variedad'));
        
        buscar_detalles.then(detalles => {
            res.status(200).send({data:venta, detalles:detalles});
        });
    })
    .catch(res.status(200).send({message:'Error server', data:undefined}));
}

const marcar_finalizado_orden = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
   
    let id = req.params['id'];

    let buscar_venta = Promise.resolve( Venta.findByIdAndUpdate({_id:id}, {
        estado: 'Finalizado'
    }));

    buscar_venta.then(
        venta => {res.status(200).send({data:venta});}
    );
}

const eliminar_orden_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];

    let buscar_venta = Promise.resolve(Venta.findOneAndRemove({_id:id}));

    buscar_venta.then(venta =>{
        Promise.resolve(Dventa.remove({venta:id})).then(    
            res.status(200).send({data:venta})
        );
    });
}

const marcar_envio_orden = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = req.body;

    let buscar_venta = Promise.resolve(Venta.findByIdAndUpdate({_id:id},{
        tracking: data.tracking,
        estado: 'Enviado'
    }));

    buscar_venta.then(venta => {
        enviar_email(venta._id, 'confirmar_envio');
        res.status(200).send({data:venta});
    });
}

const confirmar_pago_orden = async function(req,res) {
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let buscar_venta = Promise.resolve(Venta.findByIdAndUpdate({_id:id},{
        estado: 'Procesando'
    }));

    buscar_venta.then(venta => {
        let buscar_detalles = Promise.resolve+ Dventa.find({venta:id});

        buscar_detalles.then(detalles => {
            for(let element of detalles){
                let element_producto = Promise.resolve(Producto.findById({_id:element.producto}));
                let new_stock = element_producto.stock - element.cantidad;
                let new_ventas = element_producto.nventas + 1;
        
                let element_variedad = Promise.resolve(Variedad.findById({_id:element.variedad}));
                let new_stock_variedad = element_variedad.stock - element.cantidad;
        
                Promise.resolve(Producto.findByIdAndUpdate({_id: element.producto},{
                    stock: new_stock,
                    nventas: new_ventas
                })).then(
                    Promise.resolve(Variedad.findByIdAndUpdate({_id: element.variedad},{
                        stock: new_stock_variedad,
                    })).then( 
                        res.status(200).send({data:venta})
                    )
                );
            } 
        });
    })
}

const eliminar_variedad_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let buscar_var = Promise.resolve(Variedad.findByIdAndRemove({_id:id}));

    buscar_var.then(reg => {
        res.status(200).send({data:reg});
    });
}

const agregar_nueva_variedad_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;
    let crear_variedad = Promise.resolve(Variedad.create(data));

    crear_variedad.then(reg => {
        res.status(200).send({data:reg});
    });
}

const actualizar_producto_variedades_admin = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = req.body;

    let actualizar_prod = Promise.resolve(Producto.findByIdAndUpdate({_id:id},{
        titulo_variedad: data.titulo_variedad,
    }));

    actualizar_prod.then(prod => {
        res.status(200).send({data:prod});
    });
}

const registro_compra_manual_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let data = req.body;
    let detalles = data.detalles;

    data.estado = 'Procesando';
    
    let crear_venta = await Venta.create(data);

    crear_venta.then(venta => {   
        for(let element of detalles){
            element.venta = venta._id;
            element.cliente = venta.cliente;
            Promise.resolve(Dventa.create(element)).then(() => {
                let element_producto = Promise.resolve(Producto.findById({_id:element.producto}));
                let new_stock = element_producto.stock - element.cantidad;
                let new_ventas = element_producto.nventas + 1;
        
                let element_variedad = Promise.resolve(Variedad.findById({_id:element.variedad}));
                let new_stock_variedad = element_variedad.stock - element.cantidad;
        
                Promise.resolve(Producto.findByIdAndUpdate({_id: element.producto},{
                    stock: new_stock,
                    nventas: new_ventas
                })).then(
                    Promise.resolve(Variedad.findByIdAndUpdate({_id: element.variedad},{
                        stock: new_stock_variedad,
                    }))
                );  
            });

        
        }
        enviar_email(venta._id, 'confirmar_compra');
    
        res.status(200).send({venta:venta});
    });
}

const pedido_compra_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    try {
        let data = req.body;
        let detalles = data.detalles;
        let access = false;
        let producto_sl = '';

        for(let item of detalles){
            let buscar_variedad = Promise.resolve(Variedad.findById({_id:item.variedad}).populate('producto'));
            buscar_variedad.then(variedad => {
                if(variedad.stock < item.cantidad){
                    access = true;
                    producto_sl = variedad.producto.titulo;
                }
            });
        }

        if(access) {return res.status(200).send({venta:undefined,message:'Stock insuficiente para ' + producto_sl});}
        
        data.estado = 'En espera';
        let crear_venta = Promise.resolve(Venta.create(data));

        crear_venta.then(venta => {
            for(let element of detalles){
                element.venta = venta._id;
                Promise.resolve(Dventa.create(element)).then(
                    Promise.resolve(Carrito.remove({cliente:data.cliente}))
                );
            }
            enviar_email(venta._id, 'confirmar_pedido');
    
            res.status(200).send({venta:venta});
        });
    } catch (error) {
        res.status(200).send({message:'Error server', data:undefined});
    }
}


const cambiar_vs_producto_admin = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let estado = req.params['estado'];
    
    try {
        switch(estado){
            case 'Edicion':
                Promise.resolve(Producto.findByIdAndUpdate({_id:id},{estado:'Publicado'}));
                break;
            case 'Publicado':
                Promise.resolve(Producto.findByIdAndUpdate({_id:id},{estado:'Edicion'}));
                break;
        }
        res.status(200).send({data:true});
    } catch (error) {
        res.status(200).send({data:undefined});
    }
}
    
const enviar_email = async function(venta, motivo) {
    let buscar_orden = Promise.resolve(Venta.findById({_id:venta}).populate('cliente').populate('direccion'));
    
    buscar_orden.then(orden => {
        let buscar_dventa = Promise.resolve(Dventa.find({venta:venta}).populate('producto').populate('variedad'));

        buscar_dventa.then(dventa => {
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
                        '/mails/email_compra.html', 
                        'Confirmación de compra ' + orden._id
                    );
                    break;
            }
        });
    }); 
}

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