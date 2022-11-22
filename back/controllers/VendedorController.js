'use strict'

let Cliente = require('../models/cliente');
let Admin = require('../models/trabajador');
let Venta = require('../models/Venta');
let Variedad = require('../models/Variedad');
let Producto = require('../models/producto');
let Dventa = require('../models/Dventa');
let bcrypt = require('bcrypt-nodejs');
let jwt = require('../helpers/jwt');
let mail = require('../helpers/mail');
const producto = require('../models/producto');


const login_vendedor = async function(req, res){
    let data = req.body;

    let buscar_admin = Promise.resolve(Admin.findOne({email:data.email}));

    buscar_admin.then(admin => {
        if(!admin){return res.status(200).send({message: 'No se encontro el correo', data:undefined});}  

        bcrypt.compare(data.password, admin.password,async function(error, check){
            if(!check){return res.status(200).send({message: 'La contraseña no coincide', data: undefined});}

            res.status(200).send({
                data: admin,
                token: jwt.createToken(admin)
            });
        });
    });  
 } 

 const obtener_ventas_vendedor  = async function(req,res){
    if(!req.user || req.user.role != 'vendedor') {return res.status(500).send({message: 'NoAccess'});}
    
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
const obtener_detalles_ordenes_vendedor  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let buscar_venta = Promise.resolve(Venta.findById({_id:id}).populate('direccion').populate('cliente'));
        
    buscar_venta.then(venta => {
        let buscar_detalles = Promise.resolve(Dventa.find({venta: venta._id}).populate('producto').populate('variedad'));
        
        buscar_detalles.then(detalles => {
            res.status(200).send({data:venta, detalles:detalles});
        });
    })
    .catch( error=>{return res.status(200).send({message:'Error server', data:undefined})
    });
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
const registro_compra_manual_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let compra = req.body;
    let detalles = compra.detalles;

    compra.estado = 'Finalizado';
    
    let crear_venta = Promise.resolve(Venta.create(compra));

    crear_venta.then(venta => {   

        for(let element of detalles){
            element.venta = venta._id;
            element.cliente = venta.cliente;
            Promise.resolve(Dventa.create(element)).then(() => {
                let element_producto = Promise.resolve(Producto.findById({_id:element.producto}));
                element_producto.then(prod => {
                    let new_stock = prod.stock - element.cantidad;
                    let new_ventas = prod.nventas + 1;
                    let element_variedad = Promise.resolve(Variedad.findById({_id:element.variedad}));
                    element_variedad.then(data => {
                        let new_stock_variedad = data.stock - element.cantidad;
            
                        Promise.resolve(Producto.findByIdAndUpdate({_id: element.producto},{
                            stock: new_stock,
                            nventas: new_ventas
                        })).then(
                            Promise.resolve(Variedad.findByIdAndUpdate({_id: element.variedad},{
                                stock: new_stock_variedad,
                            }))
                        ); 
                    }); 
                });
                
            });
        }

        enviar_email(venta._id, 'confirmar_compra');
    
        res.status(200).send({venta:venta});
    });
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

const registro_cliente_vendedor = async function(req,res){
    if(!req.user || req.user.role !='vendedor'){return res.status(500).send({message: 'NoAccess'}); }
    
    let data = req.body;
    
    bcrypt.hash('123456789',null,null, async function(err,hash){
        if(!hash){res.status(200).send({message:'Hubo un error en el servidor',data:undefined});}
        
        data.password = hash;
        
        let existeNdoc = Promise.resolve(Cliente.findOne({numeroDocumento: data.numeroDocumento}));

        existeNdoc.then(nDoc => {
            console.log(nDoc);
            if(nDoc){return res.status(200).send({data: undefined});}
        
            let crear_cliente = Promise.resolve(Cliente.create(data));

            crear_cliente.then(reg => {
                res.status(200).send({data:reg});   
            });
        })
    });
}

const obtener_cliente_vendedor = async function (req,res){
    if(!req.user || req.user.role != 'vendedor'){return res.status(500).send({message: 'NoAccess'});}
     
    let id = req.params['id'];

    try {
        let buscar_cliente = Promise.resolve(Cliente.findById({_id:id}));

        buscar_cliente.then(reg => {
            res.status(200).send({data: reg});
        });

    } catch (error) {
        res.status(200).send({data:undefined});
    }
}

const actualizar_cliente_vendedor = async function(req,res){
    if(!req.user || req.user.role != 'vendedor'){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = req.body;

    let actualiza_cliente = Promise.resolve(actualizar_cliente(id, data));

    actualiza_cliente.then(reg => {
        res.status(200).send({data:reg});
    });
}

const eliminar_cliente_vendedor = async function (req,res){
    if(!req.user || req.user.role != 'vendedor'){return  res.status(500).send({message: 'NoAccess'});}
     
    let id = req.params['id'];

    let remover_cliente = Promise.resolve(Cliente.findByIdAndRemove({_id:id}));

    remover_cliente.then(reg => {
        res.status(200).send({data:reg});
    });

}
const actualizar_cliente = async function (id, data) { 
    return Promise.resolve (Cliente.findByIdAndUpdate({_id:id},{
        nombres: data.nombres,
        apellidos: data.apellidos,
        telefono: data.telefono,
        f_nacimiento: data.f_nacimiento,
        numeroDocumento: data.numeroDocumento,
        tipoDocumento: data.tipoDocumento,
        genero: data.genero,
        pais: data.pais,
    })); 
}
const listar_clientes_filtro_vendedor = async function (req,res){
    if(!req.user || req.user.role != 'vendedor') {return res.status(500).send({message: 'NoAccsess'});}
    
    let tipo= req.params['tipo'];
    let filtro= req.params['filtro'];
    let reg;

    switch(tipo) {
        case 'apellidos': reg = await Cliente.find({apellidos:new RegExp(filtro, 'i')});
            break;
        case 'correo': reg = await Cliente.find({email:new RegExp(filtro, 'i')});
            break;
        default: reg = await Cliente.find();
            break;
    }

    res.status(200).send({data:reg});
}
const listar_variedades_productos_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});} 

    let buscar_vars_prod = Promise.resolve( Variedad.find().populate('producto'));

    buscar_vars_prod.then(vars_prod => {
        res.status(200).send({data: vars_prod});
    });
}
const obtener_direccion_todos_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    let buscar_direcciones = Promise.resolve(Direccion.find({cliente:id}).populate('cliente').sort({createdAt:-1}));

    buscar_direcciones.then(direcciones => {
        res.status(200).send({data:direcciones});
    });
}

module.exports ={ 
    listar_variedades_productos_admin,
    obtener_direccion_todos_cliente,
    eliminar_cliente_vendedor,
    actualizar_cliente_vendedor,
    obtener_cliente_vendedor,
    registro_cliente_vendedor,
    login_vendedor,
    obtener_ventas_vendedor,
    confirmar_pago_orden,
    obtener_detalles_ordenes_vendedor,
    marcar_envio_orden,
    eliminar_orden_admin,
    marcar_finalizado_orden,
    listar_clientes_filtro_vendedor,
    registro_compra_manual_cliente,

}