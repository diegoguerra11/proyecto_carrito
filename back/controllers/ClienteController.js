'use strict'

let Cliente = require('../models/cliente');
let Carrito = require('../models/carrito');
let Venta = require('../models/Venta');
let Dventa = require('../models/Dventa');
let bcrypt = require('bcrypt-nodejs');
let jwt = require('../helpers/jwt');
let Variedad = require('../models/Variedad');
let Direccion = require("../models/direccion");
let Producto = require("../models/producto");
let mail = require('../helpers/mail');
let Review = require('../models/review');
const { promiseImpl } = require('ejs');

const registro_cliente = async function(req,res){
    try {
        let data = req.body;
          
        if(!data.password){return res.status(200).send({message: 'El campo contraseña es obligatorio', data: undefined});}
       
        bcrypt.hash(data.password,null,null, async function(err,hash){
            if(!hash){return res.status(500).send({message:'ErrorServer', data:undefined});}
            data.password = hash;
            let crear_cliente = Promise.resolve(Cliente.create(data));
            crear_cliente.then(reg => {
                res.status(200).send({data: reg});
            })
            .catch(() => {throw ex});
        });
    } catch(ex) {
        res.status(500).send({message: 'Error inesperado en el servidor'});
    }
}
 
const login_cliente = async function(req,res){
    try {
        let data = req.body;

        let buscar_user = Promise.resolve(Cliente.findOne({email: data.email}));

        buscar_user.then(user => {
            if(!user){return res.status(200).send({message: 'El correo no existe en la base de datos', data: undefined});}
            bcrypt.compare(data.password, user.password, async function(err, check) {
                if(!check){return res.status(200).send({message: 'La contraseña no coincide', data: undefined});}
                res.status(200).send({
                    data: user, 
                    token: jwt.createToken(user)
                });
            })
        }).catch(()=> {throw ex});

    } catch(ex) {
        res.status(500).send({message: 'Error inesperado en el servidor', data: undefined});
    }
}

const listar_clientes_filtro_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccsess'});}
    
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


const registro_cliente_admin = async function(req,res){
    if(!req.user || req.user.role !='admin'){return res.status(500).send({message: 'NoAccess'}); }
    
    let data = req.body;
    
    bcrypt.hash('123456789',null,null, async function(err,hash){
        if(!hash){res.status(200).send({message:'Hubo un error en el servidor',data:undefined});}
        
        data.password = hash;

        let existeNdoc = Promise.resolve(Cliente.findOne({numeroDocumento: data.numeroDocumento}));

        existeNdoc.then(nDoc => {
            if(nDoc){return res.status(200).send({data: undefined});}
        
            let crear_cliente = Promise.resolve(Cliente.create(data));

            crear_cliente.then(reg => {
                res.status(200).send({data:reg});   
            });
        })
    });
}

const obtener_cliente_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}
     
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

const actualizar_cliente_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = req.body;

    let actualiza_cliente = Promise.resolve(actualizar_cliente(id, data));

    actualiza_cliente.then(reg => {
        res.status(200).send({data:reg});
    });
}

const eliminar_cliente_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin'){return  res.status(500).send({message: 'NoAccess'});}
     
    let id = req.params['id'];

    let remover_cliente = Promise.resolve(Cliente.findByIdAndRemove({_id:id}));

    remover_cliente.then(reg => {
        res.status(200).send({data:reg});
    });

}

const obtener_cliente_guest = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    try {
        let buscar_cliente = Promise.resolve(Cliente.findById({_id:id}));

        buscar_cliente.then(reg => {
            res.status(200).send({data:reg});
        })
        .catch(() => {throw error});
    } catch (error) {
        res.status(200).send({data:undefined});
    }
}

const actualizar_perfil_cliente_guest = async function(req,res){
    if(!req.user){return  res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];
    let data = req.body;
    
    let actualiza_cliente = Promise.resolve(actualizar_cliente(id, data));

    actualiza_cliente.then(reg => {
        if (data.password) {
            bcrypt.hash(data.password,null,null, async function(err,hash){
                reg = Promise.resolve(Cliente.findByIdAndUpdate({_id:id},{
                    password: hash,
                })); 
            });
        }
        res.status(200).send({data:reg});
    })
}

/*********************************************************ORDENES********************************************/

const registro_pedido_compra_cliente = async function(req, res) {
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;
    let detalles = data.detalles;
    
    data.estado = 'Procesando';

    let venta = await Venta.create(data);

    for(let element of detalles){
        element.venta = venta._id;
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

        //limpiar carrito
        await Carrito.deleteMany({cliente:data.cliente});
    }

    enviar_email(venta._id, 'enviar_pedido');

    res.status(200).send({data:venta});
}

const obtener_ordenes_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    let buscar_ventas = Promise.resolve(Venta.find({cliente: id}).sort({createdAt: -1}));
    
    buscar_ventas.then(reg => {
        res.status(200).send({data: reg});
    })
}

const obtener_detalles_ordenes_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess', data: undefined});}

    let id = req.params['id'];

    try {
        let buscar_venta = Promise.resolve(Venta.findById({_id: id}).populate('direccion').populate('cliente'));
        buscar_venta.then(venta => {
            let buscar_detalles = Promise.resolve (Dventa.find({venta: id}).populate('producto').populate('variedad'));
            buscar_detalles.then(detalles => {
                res.status(200).send({data:venta, detalles: detalles});
            });
        }).catch(() => {throw error});
    } catch(error) {
        res.status(200).send({data: undefined});
    }
}

/*****************************************DIRECCIONES*************************************************/

const registro_direccion_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;

    desactivar_direcciones(data.cliente, data.principal).then(()=> {
        let crear_direccion = Promise.resolve(Direccion.create(data));
    
        crear_direccion.then(reg => {res.status(200).send({data:reg});});
    });
}

const eliminar_direccion_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];
    let buscar_direccion = Promise.resolve(Direccion.findByIdAndRemove({_id:id}));
    
    buscar_direccion.then(reg => {
        res.status(200).send({data:reg});
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

const cambiar_direccion_principal_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let cliente = req.params['cliente'];

    let buscar_direcciones = Promise.resolve(Direccion.find({cliente:cliente}));

    buscar_direcciones.then(direcciones => {
        direcciones.forEach(async element => {
            Promise.resolve(Direccion.findByIdAndUpdate({_id:element._id},{principal:false}));
        });
    
        Promise.resolve(Direccion.findByIdAndUpdate({_id:id},{principal:true})).then(
            res.status(200).send({data:true})
        );
    });
}

const obtener_direccion_principal_cliente  = async function(req,res){
    if(!req.user){return  res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
 
    let buscar_direccion = Promise.resolve(Direccion.findOne({cliente:id, principal:true}));

    buscar_direccion.then(direccion => {
        res.status(200).send({data:direccion});
    });
    
}

const listar_clientes_tienda = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let buscar_clientes = Promise.resolve(Cliente.find());

    buscar_clientes.then(clientes => {
        res.status(200).send({data:clientes});
    })
}

const obtener_variedades_productos_cliente = async function(req,res){
    let id = req.params['id'];

    if(id == "undefined"){return;}
    
    let buscar_variedades = Promise.resolve(Variedad.find({producto:id}));

    buscar_variedades.then(variedades => {
        res.status(200).send({data:variedades});
    });
}

const obtener_productos_slug_publico = async function(req,res){
    let slug = req.params['slug'];
    
    try {
        let buscar_producto = Promise.resolve(Producto.findOne({slug:String(slug), estado:'Publicado'}));
        
        buscar_producto.then(producto => {
            if(producto == undefined){
                res.status(200).send({data:undefined});
            }else{
                res.status(200).send({data:producto});
            }
        })
        .catch(()=> {throw error});
    } catch (error) {
        res.status(200).send({data:undefined});
    }
}

const listar_productos_recomendados_publico = async function(req,res){
    let categoria = req.params['categoria'];
    let buscar_categorias = Promise.resolve(Producto.find({categoria: categoria,estado:'Publicado'}).sort({createdAt:-1}).limit(8));

    buscar_categorias.then(reg => {
        res.status(200).send({data: reg});
    });

}

const registro_compra_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;
    let detalles = data.detalles;

    data.estado = 'Procesando';

    let venta = await Venta.create(data);

    for(let element of detalles){
        element.venta = venta._id;
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

        //limpiar carrito
        await Carrito.remove({cliente:data.cliente});
    }

    enviar_email(venta._id, 'enviar_compra');

    res.status(200).send({data:venta});
}

const consultarIDPago = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let buscar_ventas = Promise.resolve(Venta.find({transaccion:id}));
    buscar_ventas.then(ventas => {
        res.status(200).send({data:ventas});
    });
}

const enviar_email = async function(venta, motivo) {
    let buscar_orden = Promise.resolve(Venta.findById({_id:venta}).populate('cliente').populate('direccion'));
    buscar_orden.then(orden => {
        let buscar_dventa = Promise.resolve(Dventa.find({venta:venta}).populate('producto').populate('variedad'));

        buscar_dventa.then(dventa => {
            switch(motivo){
                case 'enviar_pedido':
                    mail.enviar_correo(
                        orden, 
                        dventa, 
                        '/mails/email_pedido.html', 
                        'Gracias por tu Orden '
                    );
            
                    break;
                case 'enviar_compra':
                    mail.enviar_correo(
                        orden, 
                        dventa, 
                        '/mails/email_compra.html', 
                        'Confirmación de compra ' + orden._id,
                    );
                    break;
            }
        });

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
const actualizar_direccion = async function(id,data){
    return Promise.resolve( Direccion.findByIdAndUpdate({_id:id},{
        cliente: data.cliente,//{type: Schema.ObjectId, ref: 'cliente', required: true},
        destinatario: data.destinatario,//{type: String, required: true},
        numeroDocumento: data.numeroDocumento,//{type: String, required: true},
        tipoDocumento: data.tipoDocumento,//{type: String, required: true},
        zip: data.zip,//{type: String, required: true},
        direccion: data.direccion,//{type: String, required: true},
        pais: data.pais,//{type: String, required: true},
        region: data.region,//{type: String, required: false},
        provincia: data.provincia,//{type: String, required: false},
        distrito: data.distrito,//{type: String, required: false},
        telefono: data.telefono, // {type: String, required: true},
        principal: data.principal, //{type: Boolean, required: true},
    }));
}

const desactivar_direcciones = async function(cliente, principal) {
    if(principal) {
        let buscar_direcciones = Promise.resolve(Direccion.find({cliente: cliente}));
        await buscar_direcciones.then(direcciones => {
            direcciones.forEach(async element => {
               Promise.resolve(Direccion.findByIdAndUpdate({_id:element._id},{principal:false}));
            });
        });
    }
}

const recibir_direccion_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];
    let direccion = Promise.resolve(Direccion.find({_id:String(id)}));

    direccion.then(direccion => {res.status(200).send({data:direccion});});
}

const actualizar_direccion_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];
    let data = req.body;

    desactivar_direcciones(data.cliente, data.principal).then(() => {
        let actualiza_direccion = Promise.resolve(actualizar_direccion(id,data));
        actualiza_direccion.then(reg => {
            res.status(200).send({data:reg});
        });  
    });
} 
/*****************************************RESEÑAS*************************************************/

const emitir_review_producto_cliente  = async function(req,res){
    if(req.user){
        let data = req.body; // almacena el cuerpo del formulario
        let reg = await Review.create(data); // manda la data
        res.status(200.).send({data:reg}); // manda la data al frontend
    } else {
        res.status(500).send({message: 'No Access'});
    }
}

const obtener_review_producto_cliente  = async function(req,res){
    let id = req.params['id'];
    let reg = await Review.find({producto:id}).sort({createdAt: 1});
    res.status(200).send({data:reg});
}

const obtener_reviews_cliente  = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let reg = await Review.find({cliente:id}).populate('cliente'); // manda la data
        res.status(200.).send({data:reg}); // manda la data al frontend
    } else {
        res.status(500).send({message: 'No Access'});
    }
}

// Exportaciones de métodos
const confirmar_correo = async function(req, res) {
    let correo = req.body.email;
    let buscar_correo = Promise.resolve(Cliente.exists({email: correo}));

    buscar_correo.then(existe => {
        if(!existe){return res.status(200).send({message: 'El correo ingresado no existe'});}

        mail.enviar_confirmacion_contrasenia(correo, '/mails/email_recuperar_contrasenia.html', 'Recuperacion de contraseña');

        return res.status(200).send({data: correo, message: 'Se envio el correo'});
    })
}

const cambiar_contrasenia = async function(req, res) {
    const {email, password} = req.body;

    let buscar_correo = Promise.resolve(Cliente.findOne({email: email}));

    buscar_correo.then(
        cliente => {
            bcrypt.hash(password,null,null, async function(err,hash){
                let reg = Promise.resolve(Cliente.findByIdAndUpdate({_id: cliente._id},{
                    password: hash,
                }));

                reg.then(
                    data => {res.status(200).send({data: data});}
                );
            });
        }
    )
}

module.exports = {
    actualizar_direccion_cliente,
    confirmar_correo,
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest,
    registro_pedido_compra_cliente,
    obtener_ordenes_cliente,
    obtener_detalles_ordenes_cliente,
    registro_direccion_cliente,
    obtener_direccion_todos_cliente,
    cambiar_direccion_principal_cliente,
    obtener_direccion_principal_cliente,
    eliminar_direccion_cliente,
    listar_clientes_tienda,
    obtener_variedades_productos_cliente,
    obtener_productos_slug_publico,
    listar_productos_recomendados_publico,
    registro_compra_cliente,
    consultarIDPago,
    recibir_direccion_cliente,
    emitir_review_producto_cliente,
    obtener_review_producto_cliente,
    obtener_reviews_cliente,
    cambiar_contrasenia
}
