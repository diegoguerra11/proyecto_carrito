'use strict'

var Cliente = require('../models/cliente');
var Carrito = require('../models/carrito');
var Venta = require('../models/Venta');
var Dventa = require('../models/Dventa');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
var Variedad = require('../models/Variedad');
var Direccion = require("../models/direccion");
var Producto = require("../models/producto");

const registro_cliente = async function(req,res){
    try {
        var data = req.body;
        
        

        /*Validaciones*/ 
       if(!data.password){return res.status(200).send({message: 'El campo contraseña es obligatorio', data: undefined});}

        var existe_correo = await Cliente.findOne({email: data.email});
        
        console.log(data.email);
       
        /*Termina validaciones*/

        bcrypt.hash(data.password, null, null, async function(err, hash) {
            if(!hash){throw ex;}
            data.password = hash;
            var reg = await Cliente.create(data);
            res.status(200).send({data: reg});
        });
    } catch(ex) {
        res.status(500).send({message: 'Error inesperado en el servidor'});
    }
}
 
const login_cliente = async function(req,res){
    try {
        var data = req.body;

        var user = await Cliente.findOne({email: data.email});

        /*Validaciones*/
        if(!user){return res.status(200).send({message: 'El correo no existe en la base de datos', data: undefined});}
        /*Termina validaciones*/

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

const listar_clientes_filtro_admin = async function (req,res){
    console.log(req.user);
    if(req.user){
        if(req.user.role == 'admin'){
            let tipo= req.params['tipo'];
            let filtro= req.params['filtro'];

              console.log(tipo);

            if(tipo == null || tipo == 'null'){
                let reg = await Cliente.find();
                res.status(200).send({data:reg});

            }else{
                if(tipo =='apellidos'){
                    let reg = await Cliente.find({apellidos:new RegExp(filtro, 'i')});
                    res.status(200).send({data:reg});
                }else if(tipo == 'correo'){
                    let reg = await Cliente.find({email:new RegExp(filtro, 'i')});
                    res.status(200).send({data:reg});
                }
    }

        }else {
            res.status(500).send({message: 'NoAccsess'});
        }
    }else{
        res.status(500).send({message: 'NoAccsess'});
    }

}

const registro_cliente_admin = async function(req,res){
    if(!req.user || req.user.role !='admin'){return res.status(500).send({message: 'NoAccess'}); }
    
    var data = req.body;

    bcrypt.hash('123456789',null,null, async function(err,hash){
        if(hash){
            data.password = hash;
            let existeNdoc = await Cliente.findOne({numeroDocumento: data.numeroDocumento});
        console.log(existeNdoc);   
        if(existeNdoc){
            res.status(200).send({data: undefined});
        }else{
            let reg = await Cliente.create(data);
            res.status(200).send({data:reg});
        }
            
        }else{
            res.status(200).send({message:'Hubo un error en el servidor',data:undefined});
        }
    });
}


const obtener_cliente_admin = async function (req,res){
    if(req.user){
        if(req.user.role =='admin'){
            
            var id = req.params['id'];

            try {
                var reg = await Cliente.findById({_id:id});

                res.status(200).send({data:reg});
            } catch (error) {
                res.status(200).send({data:undefined});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const actualizar_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role =='admin'){
            
            var id = req.params['id'];
            var data = req.body;

            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                telefono:data.telefono,
                f_nacimiento: data.f_nacimiento,
                numeroDocumento: data.numeroDocumento,
                tipoDocumento: data.tipoDocumento,
                genero: data.genero
            })
            res.status(200).send({data:reg});

        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_cliente_admin = async function (req,res){
    if(req.user){
        if(req.user.role =='admin'){
            
           var id = req.params['id'];

           let reg = await Cliente.findByIdAndRemove({_id:id});
           res.status(200).send({data:reg});

        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAcceess'});
    }
}

const obtener_cliente_guest = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        try {
            var reg = await Cliente.findById({_id:id});

            res.status(200).send({data:reg});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const actualizar_perfil_cliente_guest = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var data = req.body;

        console.log(data.password);

        if (data.password) {
            console.log('con contraseña');
            bcrypt.hash(data.password,null,null, async function(err,hash){
                var reg = await Cliente.findByIdAndUpdate({_id:id},{
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    telefono: data.telefono,
                    f_nacimiento: data.f_nacimiento,
                    numeroDocumento: data.numeroDocumento,
                    tipoDocumento: data.tipoDocumento,
                    genero: data.genero,
                    pais: data.pais,
                    password: hash,
                }); 
                res.status(200).send({data:reg});
            });
            
        } else {
            console.log('sin contraseña');
            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                numeroDocumento: data.numeroDocumento,
                tipoDocumento: data.tipoDocumento,
                genero: data.genero,
                pais: data.pais,
            });
            res.status(200).send({data:reg});
        }registro_pedido_compra_cliente
       
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

/*********************************************************ORDENES********************************************/

const registro_pedido_compra_cliente = async function(req, res) {
    if(!req.user){return  res.status(500).send({message: 'NoAccess'});}
    
    var data = req.body;
    var detalles = data.detalles;
    
    data.estado = 'Procesando';

    let venta = await Venta.create(data);

    for(var element of detalles){
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

    //enviar_orden_compra(venta._id);

    res.status(200).send({data:venta});
}

const obtener_ordenes_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    var id = req.params['id'];

    let reg = await Venta.find({cliente: id}).sort({createdAt: -1});

    res.status(200).send({
        data: reg
    });
}

const obtener_detalles_ordenes_cliente  = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess', data: undefined});}

    var id = req.params['id'];

    try {
        let venta = await Venta.findById({_id: id}).populate('direccion').populate('cliente');
        let detalles = await Dventa.find({venta: id}).populate('producto').populate('variedad');

        res.status(200).send({data:venta, detalles: detalles});
    } catch(error) {
        res.status(200).send({data: undefined});
    }
}

/*****************************************DIRECCIONES*************************************************/

const registro_direccion_cliente  = async function(req,res){
    if(req.user){
        var data = req.body;

        if(data.principal){
            let direcciones = await Direccion.find({cliente:data.cliente});

            direcciones.forEach(async element => {
                await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});
            });
        }
        

        let reg = await Direccion.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_direccion_cliente = async function(req,res){
    console.log("miau");
    if(req.user){
        var id = req.params['id'];
        console.log(id);
        let reg = await Direccion.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});
    
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_direccion_todos_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        let direcciones = await Direccion.find({cliente:id}).populate('cliente').sort({createdAt:-1});
        res.status(200).send({data:direcciones});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const cambiar_direccion_principal_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var cliente = req.params['cliente'];

        let direcciones = await Direccion.find({cliente:cliente});

        direcciones.forEach(async element => {
            await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});
        });

        await Direccion.findByIdAndUpdate({_id:id},{principal:true});
 
        res.status(200).send({data:true});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_direccion_principal_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var direccion = undefined;
     
        direccion = await Direccion.findOne({cliente:id,principal:true});
        
        if(direccion == undefined){
            res.status(200).send({data:undefined});
        }else{
            res.status(200).send({data:direccion});
        }
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const listar_clientes_tienda = async function(req,res){
    if(req.user){
        var clientes = await Cliente.find();
        res.status(200).send({data:clientes});
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}

const obtener_variedades_productos_cliente = async function(req,res){
    let id = req.params['id'];

    if(id == "undefined"){return;}

    console.log(id + "miau");
    
    let variedades = await Variedad.find({producto:id});
    res.status(200).send({data:variedades});
}

const obtener_productos_slug_publico = async function(req,res){
    var slug = req.params['slug'];
    
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

const listar_productos_recomendados_publico = async function(req,res){
    var categoria = req.params['categoria'];
    let reg = await Producto.find({categoria: categoria,estado:'Publicado'}).sort({createdAt:-1}).limit(8);
    res.status(200).send({data: reg});
}
const registro_compra_cliente = async function(req,res){
    if(req.user){

        var data = req.body;
        var detalles = data.detalles;

        data.estado = 'Procesando';

        let venta = await Venta.create(data);

        for(var element of detalles){
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

        enviar_orden_compra(venta._id);

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}
const enviar_orden_compra = async function(venta){
    try {
        var readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'renzo.carrascom@gmail.com',
                pass: 'mjqzblcffaegvdzm'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_compra.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'renzo.carrascom@gmail.com',
                to: orden.cliente.email,
                subject: 'Confirmación de compra ' + orden._id,
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
}
const consultarIDPago = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var ventas = await Venta.find({transaccion:id});
        res.status(200).send({data:ventas});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

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