'use strict'

//Declaración de variables para Cliente.
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

//Función para registro de cliente. El programa solicitará un usuario y contraseña, los cuales serán necesarios para el inicio de sesión.
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

//Inicio de sesión de un cliente. El cliente debe estar registrado en el sistema para poder ingresar como usuario.
const login_cliente = async function(req,res){
    try {
        let data = req.body;

        let buscar_user = Promise.resolve(Cliente.findOne({email: data.email}));

        buscar_user.then(user => {
            if(!user){return res.status(200).send({message: 'El correo no existe en la base de datos', data: undefined});}
            if(!user.estado){return res.status(200).send({message: 'Cuenta inactiva'});}
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

//Función para registrar clientes desde el panel de Admin. El administrador del sistema podrá registrar clientes desde su panel.
const registro_cliente_admin = async function(req,res){
    if(!req.user || req.user.role !='admin'){return res.status(500).send({message: 'NoAccess'}); }
    
    let data = req.body;
    
    bcrypt.hash('Password123$',null,null, async function(err,hash){
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

//Función para obtener la lista de clientes registrados en el panel de Admin. El administrador podrá solicitar la lista de clientes registrados en el sistema ordenados por su id.
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



//Función para modificar clientes en el panel de Admin. El administrador podrá modificar datos de un cliente seleccionándolo en la lista de clientes.
const actualizar_cliente_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = req.body;

    let actualiza_cliente = Promise.resolve(actualizar_cliente(id, data));

    actualiza_cliente.then(reg => {
        res.status(200).send({data:reg});
    });
}

//Función para eliminar clientes en el panel de Admin. El administrador podrá eliminar a un cliente mediante su id y borrando sus datos de la base de datos.
const eliminar_cliente_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin'){return  res.status(500).send({message: 'NoAccess'});}
     
    let id = req.params['id'];

    let remover_cliente = Promise.resolve(Cliente.findByIdAndRemove({_id:id}));

    remover_cliente.then(reg => {
        res.status(200).send({data:reg});
    });

}

//Función para ver los datos del usuario. El cliente podrá ver los datos de su cuenta en una vista propia del usuario.
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

//Función para modificar los datos del cliente. El cliente podrá modificar los datos de su cuenta como su nombre de usuario o contraseña.
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

//Función para que el cliente pueda registrar un pedido. En el pedido se registrarán los productos con sus detalles como la variedad y el precio, a la vez que se irán actualizando estos
//detalles en la tienda.
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

    await enviar_email(venta._id, 'enviar_pedido');

    res.status(200).send({data:venta});
}

//Función para listar las órdenes de compra realizadas por el cliente. Se modtrarán las órdenes de compra ordenadas por la fecha de haber sido realizada.
const obtener_ordenes_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    let buscar_ventas = Promise.resolve(Venta.find({cliente: id}).sort({createdAt: -1}));
    
    buscar_ventas.then(reg => {
        res.status(200).send({data: reg});
    })
}


//Función para mostrar los detalles de una orden de compra. El cliente puede ver los detalles de cada orden de compra que haya realizado.
const obtener_detalles_ordenes_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    let buscar_venta = Promise.resolve(Venta.findById({_id: id}).populate('direccion').populate('cliente'));
    buscar_venta.then(venta => {
        let buscar_detalles = Promise.resolve (Dventa.find({venta: id}).populate('producto').populate('variedad'));
        buscar_detalles.then(detalles => {
            res.status(200).send({data:venta, detalles: detalles});
        });
    }).catch(() => res.status(200).send({message: 'Error server'}));
}



/*****************************************DIRECCIONES*************************************************/

//Función para registrar la dirección del cliente. El cliente podrá registrar su dirección que será utilizada para realizar sus compras.
const registro_direccion_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;

    desactivar_direcciones(data.cliente, data.principal).then(()=> {
        let crear_direccion = Promise.resolve(Direccion.create(data));
    
        crear_direccion.then(reg => {res.status(200).send({data:reg});});
    });
}

//Función para eliminar la dirección del cliente. El cliente podrá eliminar la dirección que se encuentre registrada.
const eliminar_direccion_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];
    let buscar_direccion = Promise.resolve(Direccion.findByIdAndRemove({_id:id}));
    
    buscar_direccion.then(reg => {
        res.status(200).send({data:reg});
    });

}

//Función para listar las direcciones del cliente. El cleinte podrá ver el listado de las direcciones que haya registrado.
const obtener_direccion_todos_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    let buscar_direcciones = Promise.resolve(Direccion.find({cliente:id}).populate('cliente').sort({createdAt:-1}));

    buscar_direcciones.then(direcciones => {
        res.status(200).send({data:direcciones});
    });
}

//Función para cambiar la dirección principal del cliente. El cliente puede elegir la dirección principal de todas las direcciones que haya registrado.
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

//Función para mostrar la dirección principal del cliente. El cliente podrá verificar que, al momento de realizar la especificación de su pedido, 
//el sistema pueda obtener la dirección principal de envío.
const obtener_direccion_principal_cliente  = async function(req,res){
    if(!req.user){return  res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
 
    let buscar_direccion = Promise.resolve(Direccion.findOne({cliente:id, principal:true}));

    buscar_direccion.then(direccion => {
        res.status(200).send({data:direccion});
    });
    
}

//Función para listar los clientes de la tienda con sus respectivos datos.
const listar_clientes_tienda = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let buscar_clientes = Promise.resolve(Cliente.find());

    buscar_clientes.then(clientes => {
        res.status(200).send({data:clientes});
    })
}

//Función para obtener las variedades de los productos del carrito del cliente.
const obtener_variedades_productos_cliente = async function(req,res){
    let id = req.params['id'];

    if(id == "undefined"){return;}
    
    let buscar_variedades = Promise.resolve(Variedad.find({producto:id}));

    buscar_variedades.then(variedades => {
        res.status(200).send({data:variedades});
    });
}

//Función para obtener el slug público del producto, el cual se modtrará en la url de manera más agradable al usuario.
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

//Función para listar los productos recomendados al público en general. Se mostrará en una lista los productos que la tienda ha establecido como 'recomendados'.
const listar_productos_recomendados_publico = async function(req,res){
    let categoria = req.params['categoria'];
    let buscar_categorias = Promise.resolve(Producto.find({categoria: categoria,estado:'Publicado'}).sort({createdAt:-1}).limit(8));

    buscar_categorias.then(reg => {
        res.status(200).send({data: reg});
    });

}

//Función para registrar la compra del cliente. Si el cliente realiza la compra via internet, el sistema procesará la compra y la registrará con los detalles de los productos del carrito
//del cliente.
const registro_compra_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;
    let detalles = data.detalles;

    data.estado = 'Procesando';

    let registar_venta = Promise.resolve(Venta.create(data));

    registar_venta.then(venta => {
        for(let element of detalles){
            element.venta = venta._id;
            Dventa.create(element);

            let element_producto = Producto.findById({_id:element.producto});
            let new_stock = element_producto.stock - element.cantidad;
            let new_ventas = element_producto.nventas + 1;

            let element_variedad = Variedad.findById({_id:element.variedad});
            let new_stock_variedad = element_variedad.stock - element.cantidad;

            Producto.findByIdAndUpdate({_id: element.producto},{
                stock: new_stock,
                nventas: new_ventas
            });

            Variedad.findByIdAndUpdate({_id: element.variedad},{
                stock: new_stock_variedad,
            });

            //limpiar carrito
            Carrito.remove({cliente:data.cliente});
        }

        enviar_email(venta._id, 'enviar_compra');

        res.status(200).send({data:venta});
    });
}

//Función para consultar el id del pago que fue utilizado durante la transacción de compra por parte del cliente.
const consultarIDPago = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let buscar_ventas = Promise.resolve(Venta.find({transaccion:id}));
    buscar_ventas.then(ventas => {
        res.status(200).send({data:ventas});
    });
}

//Función para ingresar un email de comunicación al finalizar una compra. El cliente ingresará un email donde recibirá el comprobante de pago con los detalles de la compra.
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

//Función para actualizar datos de un cliente. Esta función actualiza los datos del cliente y los guarda en la base de datos.
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
    let recibir_direccion = Promise.resolve(Direccion.find({_id:String(id)}));

    recibir_direccion.then(direccion => {res.status(200).send({data:direccion});});
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
    if(!req.user){return res.status(500).send({message: 'No Access'});}

    let data = req.body; // almacena el cuerpo del formulario
    let registrar_review = Promise.resolve(Review.create(data)); // manda la data
    registrar_review.then(reg => {
        res.status(200.).send({data:reg}); // manda la data al frontend
    })
}

const obtener_review_producto_cliente  = async function(req,res){
    let id = req.params['id'];
    let obtener_review = Promise.resolve(Review.find({producto:id}).sort({createdAt: 1}));
    obtener_review.then(reg => {
        res.status(200).send({data:reg});
    });
}

const obtener_reviews_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'No Access'});}
    let id = req.params['id'];
    let obtener_reviews = Promise.resolve(Review.find({cliente:id}).populate('cliente')); // manda la data
    obtener_reviews.then(reg => {
        res.status(200.).send({data:reg}); // manda la data al frontend
    });
}
const obtener_reviews_producto_publico = async function(req,res){
    let id = req.params['id'];

    let reviews = await Review.find({producto:id}).populate('cliente').sort({createdAt:-1});
    res.status(200).send({data: reviews});
}


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

const desactivar_cliente_vendedor = async function(req, res) {
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    try {
        let actualizar_cliente = Promise.resolve(Cliente.findByIdAndUpdate({_id: id}, {estado: false}));

        actualizar_cliente.then(
            cliente => {
                res.status(200).send({data:cliente});
            } 
        )
    }catch(error){
        res.status(200).send({data:undefined, message:'Error en el servidor'});
    }
}

const activar_cliente_vendedor = async function(req,res) {
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    try {
        let actualizar_cliente = Promise.resolve(Cliente.findByIdAndUpdate({_id: id}, {estado: true}));

        actualizar_cliente.then(
            cliente => {
                res.status(200).send({data:cliente});
            } 
        )
    }catch(error){
        res.status(200).send({data:undefined, message:'Error en el servidor'});
    }
}

//Exportación de las funciones.
module.exports = {
    actualizar_direccion_cliente,
    confirmar_correo,
    registro_cliente,
    login_cliente,
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
    cambiar_contrasenia,
    activar_cliente_vendedor,
    obtener_reviews_producto_publico,
    desactivar_cliente_vendedor
}
