'use strict'

let Trabajador = require('../models/trabajador');
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

    if(!data.password){return res.status(200).send({message:'El campo contraseña es obligatorio', data:undefined});}

    let existe_correo = Promise.resolve(Trabajador.exists({email: data.email}));

    existe_correo.then(existe => {
        if(existe){return res.status(200).send({message:'El correo ya existe en la base de datos', data:undefined});}

        bcrypt.hash(data.password,null,null, async function(err,hash){
            if(!hash){return res.status(500).send({message:'ErrorServer', data:undefined});}
            data.password = hash;
            let reg = await Trabajador.create(data);
            res.status(200).send({data:reg});
        });
    });
}

//Inicio de sesión en panel de Admin. 
const login_admin = async function(req, res){
    let data = req.body;

    let buscar_Trabajador = Promise.resolve(Trabajador.findOne({email:data.email}));

    buscar_Trabajador.then(trabajador => {
        if(!trabajador){return res.status(200).send({message: 'No se encontro el correo'});}  
        if(!trabajador.estado){return res.status(200).send({message:'Cuenta inactiva'});}
        if(trabajador.rol != 'admin' && trabajador.rol != 'superAdmin'){
            return res.status(200).send({message: 'Sin los permisos necesarios para acceder'});
        }  

        bcrypt.compare(data.password, trabajador.password,async function(error, check){
            if(!check){return res.status(200).send({message: 'La contraseña no coincide'});}

            res.status(200).send({
                data: trabajador,
                token: jwt.createToken(trabajador)
            });
        });
    });  
 } 

 //Función para solicitar el registro de ventas en Admin.
 const obtener_ventas_admin  = async function(req,res){

    //Restricción realizada a los usuarios: si no son usuarios con el rol de administrador, no podrán acceder a esta función.
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
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

//Función para el listado de variedades en Admin. Se podrá listar las variedades por su id.
const listar_variedades_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let buscar_variedades = Promise.resolve(Variedad.find({producto:id}));

    buscar_variedades.then(data => {
        res.status(200).send({data: data});
    });
}

//Función para el listado de productos por variedades en Admin. Se podrá listar las variedades y los productos que tengan estas variedades.
const listar_variedades_productos_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});} 

    let buscar_vars_prod = Promise.resolve( Variedad.find().populate('producto'));

    buscar_vars_prod.then(vars_prod => {
        res.status(200).send({data: vars_prod});
    });
}

//Función para obtener los detalles de la orden realizada por el cliente. El cliente podrá ver los detalles de la orden realizada, tales como el monto a pagar y los productos especificados.
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

//Función para marcar una orden de pedido como 'Finalizado'. El usuario puede establecer su orden de pedido como finalizada cuando haya recibido el producto.
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

const cancelar_orden_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];

    let buscar_venta = Promise.resolve(Venta.findOneAndUpdate({_id:id}, {estado:'Cancelado'}));

    buscar_venta.then(venta =>{
        res.status(200).send({data:venta})
    });
}

//Función para marcar una orden de pedido como 'Enviado'. El usuario puede establecer la orden de pedido como 'Enviado' cuando el pedido haya sido enviado.
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

//Función que confirma el pago de un cliente de su orden de pedido. El sistema actualizará los datos de los productos como el stock y las ventas realizadas.
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

//Función para eliminar una variedad de la lista de variedades. El administrador podrá eliminar una variedad de producto.
const eliminar_variedad_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let buscar_var = Promise.resolve(Variedad.findByIdAndRemove({_id:id}));

    buscar_var.then(reg => {
        res.status(200).send({data:reg});
    });
}

//Función para agregar nueva variedad de producto. El administrador podrá agregar una nueva variedad de producto.
const agregar_nueva_variedad_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;
    let crear_variedad = Promise.resolve(Variedad.create(data));

    crear_variedad.then(reg => {
        res.status(200).send({data:reg});
    });
}

//Función para modificar una variedad de producto. El administrador podrá modificar los datos de una variedad existente. 
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

//Función para cambiar la visibilidad del producto en el catálogo de la tienda. Los productos que se encuentren como 'publicados' son los productos visibles en el catálogo virtual,
//mientras que los que se encuentren en 'edición' son aquellos que no están visibles en el catálogo.
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
//KPIS 
const kpi_ganancias_mensuales_admin  = async function (req,res){

    //Restricción realizada a los usuarios: si no son usuarios con el rol de administrador, no podrán acceder a esta función.
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
   let enero = 0;
   let febrero = 0;
   let marzo = 0;
   let abril = 0;
   let mayo = 0;
   let junio = 0;
   let julio = 0;
   let agosto = 0;
   let septiembre = 0;
   let octubre = 0;
   let noviembre = 0;
   let diciembre = 0;
    
   let total_ganancia = 0;
   let total_mes = 0;
   let cont_ventas = 0;
   let total_mes_anterior = 0;

    let buscar_ventas = Promise.resolve(Venta.find({createdAt:{$gte: new Date(new Date().getFullYear()+'-01-01')}}));
    let current_date = new Date();
    let current_month = current_date.getMonth()+1;

    buscar_ventas.then(ventas => {
        for(let venta of ventas){
            cont_ventas++;
            let createdAt_date = new Date(venta.createdAt);
            let mes = createdAt_date.getMonth()+1;
            total_ganancia += venta.subtotal;
            if(mes == current_month){
                total_mes += venta.subtotal;
            }
            if(mes == current_month-1){
                total_mes_anterior += venta.subtotal;
            }
            switch (mes) {
                case 1:
                    enero = enero + venta.subtotal;
                    break;
                case 2:
                    febrero = febrero + venta.subtotal;
                    break;
                case 3:
                    marzo = marzo + venta.subtotal;
                    break;  
                case 4:
                    abril = abril + venta.subtotal;
                    break;
                case 5:
                    mayo = mayo + venta.subtotal;
                    break;
                case 6:
                    junio =  junio + venta.subtotal;
                    break;   
                case 7:
                    julio = julio + venta.subtotal;
                    break;
                case 8:
                    agosto = agosto + venta.subtotal;
                    break;
                case 9:
                    septiembre = septiembre + venta.subtotal;
                    break;  
                case 10:
                    octubre = octubre + venta.subtotal;
                    break;
                case 11:
                    noviembre = noviembre + venta.subtotal;
                    break;
                case 12:
                    diciembre = diciembre + venta.subtotal;
                    break; 
                
            }
        }
        
        res.status(200).send({
            enero:enero, 
            febrero: febrero,
            marzo:marzo,
            abril:abril,
            mayo:mayo,
            junio:junio,
            julio:julio,
            agosto:agosto,
            septiembre:septiembre,
            octubre:octubre,
            noviembre:noviembre,
            diciembre:diciembre,
            total_ganancia:total_ganancia,
            total_mes:total_mes,
            cont_ventas:cont_ventas,
            total_mes_anterior:total_mes_anterior,
        });
    });
}
//Exportación de las funciones.
module.exports ={
    registro_admin,
    login_admin,
    obtener_ventas_admin,
    listar_variedades_admin,
    kpi_ganancias_mensuales_admin,
    listar_variedades_productos_admin,
    confirmar_pago_orden,
    obtener_detalles_ordenes_cliente,
    marcar_envio_orden,
    cancelar_orden_admin,
    marcar_finalizado_orden,
    agregar_nueva_variedad_admin, 
    eliminar_variedad_admin,
    actualizar_producto_variedades_admin,
    pedido_compra_cliente,
    cambiar_vs_producto_admin,
}