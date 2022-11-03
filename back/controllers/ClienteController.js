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

//Función para registro de cliente. El programa solicitará un usuario y contraseña, los cuales serán necesarios para el inicio de sesión.
const registro_cliente = async function(req,res){
    try {
        let data = req.body;
          
        if(!data.password){return res.status(200).send({message: 'El campo contraseña es obligatorio', data: undefined});}
       
        data.password = crypt.encrypt(data.password, res);
        
        let reg = await Cliente.create(data);

        res.status(200).send({data: reg});
    } catch(ex) {
        res.status(500).send({message: 'Error inesperado en el servidor'});
    }
}

//Inicio de sesión de un cliente. El cliente debe estar registrado en el sistema para poder ingresar como usuario.
const login_cliente = async function(req,res){
    try {
        let data = req.body;

        let user = await Cliente.findOne({email: data.email});

        if(!user){return res.status(200).send({message: 'El correo no existe en la base de datos', data: undefined});}
        bcrypt.compare(data.password, user.password, async function(err, check) {
            if(!check){return res.status(200).send({message: 'La contraseña no coincide', data: undefined});}
            res.status(200).send({
                data: user, 
                token: jwt.createToken(user)
            });
        })
    } catch(ex) {
        res.status(500).send({message: 'Error inesperado en el servidor', data: undefined});
    }
}

//Función para listar los clientes mediante filtros en el panel de Admin. El administrador del sistema podrá filtrar los clientes registrados por su apellido o correo.
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

//Función para registrar clientes desde el panel de Admin. El administrador del sistema podrá registrar clientes desde su panel.
const registro_cliente_admin = async function(req,res){
    if(!req.user || req.user.role !='admin'){return res.status(500).send({message: 'NoAccess'}); }
    
    let data = req.body;
    
    bcrypt.hash('123456789',null,null, async function(err,hash){
        if(!hash){res.status(200).send({message:'Hubo un error en el servidor',data:undefined});}
        
        data.password = hash;

        let existeNdoc = await Cliente.findOne({numeroDocumento: data.numeroDocumento});

        if(existeNdoc){return res.status(200).send({data: undefined});}
        
        let reg = await Cliente.create(data);

        res.status(200).send({data:reg});     
    });
}

//Función para obtener la lista de clientes registrados en el panel de Admin. El administrador podrá solicitar la lista de clientes registrados en el sistema ordenados por su id.
const obtener_cliente_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}
     
    let id = req.params['id'];

    try {
        let reg = await Cliente.findById({_id:id});

        res.status(200).send({data: reg});
    } catch (error) {
        res.status(200).send({data:undefined});
    }
}

//Función para modificar clientes en el panel de Admin. El administrador podrá modificar datos de un cliente seleccionándolo en la lista de clientes.
const actualizar_cliente_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let data = req.body;

    let reg = await actualizar_cliente(id, data);

    res.status(200).send({data:reg});
}

//Función para eliminar clientes en el panel de Admin. El administrador podrá eliminar a un cliente mediante su id y borrando sus datos de la base de datos.
const eliminar_cliente_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin'){return  res.status(500).send({message: 'NoAccess'});}
     
    let id = req.params['id'];

    let reg = await Cliente.findByIdAndRemove({_id:id});

    res.status(200).send({data:reg});
}

//Función para ver los datos del usuario. El cliente podrá ver los datos de su cuenta en una vista propia del usuario.
const obtener_cliente_guest = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    try {
        let reg = await Cliente.findById({_id:id});

        res.status(200).send({data:reg});
    } catch (error) {
        res.status(200).send({data:undefined});
    }
}

//Función para modificar los datos del cliente. El cliente podrá modificar los datos de su cuenta como su nombre de usuario o contraseña.
const actualizar_perfil_cliente_guest = async function(req,res){
    if(!req.user){return  res.status(500).send({message: 'NoAccess'});}
    let id = req.params['id'];
    let data = req.body;
    
    let reg = await actualizar_cliente(id, data);

    if (data.password) {
        bcrypt.hash(data.password,null,null, async function(err,hash){
            reg = await Cliente.findByIdAndUpdate({_id:id},{
                password: hash,
            }); 
        });
    }

    res.status(200).send({data:reg});
}

/*********************************************************ORDENES********************************************/

//Función para que el cliente pueda registrar un pedido. En el pedido se registrarán los productos con sus detalles como la variedad y el precio, a la vez que se irán actualizando estos
//detalles en la tienda.
const registro_pedido_compra_cliente = async function(req, res) {
    if(!req.user){return  res.status(500).send({message: 'NoAccess'});}
    
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

//Función para listar las órdenes de compra realizadas por el cliente. Se modtrarán las órdenes de compra ordenadas por la fecha de haber sido realizada.
const obtener_ordenes_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    let reg = await Venta.find({cliente: id}).sort({createdAt: -1});

    res.status(200).send({data: reg});
}


//Función para mostrar los detalles de una orden de compra. El cliente puede ver los detalles de cada orden de compra que haya realizado.
const obtener_detalles_ordenes_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess', data: undefined});}

    let id = req.params['id'];

    try {
        let venta = await Venta.findById({_id: id}).populate('direccion').populate('cliente');
        let detalles = await Dventa.find({venta: id}).populate('producto').populate('variedad');

        res.status(200).send({data:venta, detalles: detalles});
    } catch(error) {
        res.status(200).send({data: undefined});
    }
}

/*****************************************DIRECCIONES*************************************************/

//Función para registrar la dirección del cliente. El cliente podrá registrar su dirección que será utilizada para realizar sus compras.
const registro_direccion_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;

    if(data.principal){
        let direcciones = await Direccion.find({cliente:data.cliente});

        direcciones.forEach(async element => {
            await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});
        });
    }
    let reg = await Direccion.create(data);
    
    res.status(200).send({data:reg});
}

//Función para eliminar la dirección del cliente. El cliente podrá eliminar la dirección que se encuentre registrada.
const eliminar_direccion_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];
    let reg = await Direccion.findByIdAndRemove({_id:id});
    
    res.status(200).send({data:reg});
}

//Función para listar las direcciones del cliente. El cleinte podrá ver el listado de las direcciones que haya registrado.
const obtener_direccion_todos_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];

    let direcciones = await Direccion.find({cliente:id}).populate('cliente').sort({createdAt:-1});
    res.status(200).send({data:direcciones});
}

//Función para cambiar la dirección principal del cliente. El cliente puede elegir la dirección principal de todas las direcciones que haya registrado.
const cambiar_direccion_principal_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let cliente = req.params['cliente'];

    let direcciones = await Direccion.find({cliente:cliente});

    direcciones.forEach(async element => {
        await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});
    });

    await Direccion.findByIdAndUpdate({_id:id},{principal:true});

    res.status(200).send({data:true});
}

//Función para mostrar la dirección principal del cliente. El cliente podrá verificar que, al momento de realizar la especificación de su pedido, 
//el sistema pueda obtener la dirección principal de envío.
const obtener_direccion_principal_cliente  = async function(req,res){
    if(!req.user){return  res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let direccion = undefined;
 
    direccion = await Direccion.findOne({cliente:id, principal:true});
    
    res.status(200).send({data:direccion});
}

//Función para listar los clientes de la tienda con sus respectivos datos.
const listar_clientes_tienda = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let clientes = await Cliente.find();
    res.status(200).send({data:clientes});
}

//Función para obtener las variedades de los productos del carrito del cliente.
const obtener_variedades_productos_cliente = async function(req,res){
    let id = req.params['id'];

    if(id == "undefined"){return;}
    
    let variedades = await Variedad.find({producto:id});
    res.status(200).send({data:variedades});
}

//Función para obtener el slug público del producto, el cual se modtrará en la url de manera más agradable al usuario.
const obtener_productos_slug_publico = async function(req,res){
    let slug = req.params['slug'];
    
    try {
        let producto = await Producto.findOne({slug:String(slug), estado:'Publicado'});
        
        if(producto == undefined){
            res.status(200).send({data:undefined});
        }else{
            res.status(200).send({data:producto});
        }
    } catch (error) {
        res.status(200).send({data:undefined});
    }
}

//Función para listar los productos recomendados al público en general. Se mostrará en una lista los productos que la tienda ha establecido como 'recomendados'.
const listar_productos_recomendados_publico = async function(req,res){
    let categoria = req.params['categoria'];
    let reg = await Producto.find({categoria: categoria,estado:'Publicado'}).sort({createdAt:-1}).limit(8);
    res.status(200).send({data: reg});
}

//Función para registrar la compra del cliente. Si el cliente realiza la compra via internet, el sistema procesará la compra y la registrará con los detalles de los productos del carrito
//del cliente.
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

//Función para consultar el id del pago que fue utilizado durante la transacción de compra por parte del cliente.
const consultarIDPago = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];
    let ventas = await Venta.find({transaccion:id});
    res.status(200).send({data:ventas});
}

//Función para ingresar un email de comunicación al finalizar una compra. El cliente ingresará un email donde recibirá el comprobante de pago con los detalles de la compra.
const enviar_email = async function(venta, motivo) {
    let orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
    let dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');

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
                '/mails/email_pedido.html', 
                'Confirmación de compra ' + orden._id,
            );
            break;
    }
}

//Función para actualizar datos de un cliente. Esta función actualiza los datos del cliente y los guarda en la base de datos.
const actualizar_cliente = async function (id, data) { 
    return Cliente.findByIdAndUpdate({_id:id},{
        nombres: data.nombres,
        apellidos: data.apellidos,
        telefono: data.telefono,
        f_nacimiento: data.f_nacimiento,
        numeroDocumento: data.numeroDocumento,
        tipoDocumento: data.tipoDocumento,
        genero: data.genero,
        pais: data.pais,
    }); 
}

//Exportación de las funciones.
module.exports = {
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
}
