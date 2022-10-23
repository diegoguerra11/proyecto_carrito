'use strict'

var Cliente = require('../models/cliente');
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
        if(existe_correo){return res.status(200).send({message: 'El correo ya existe en la base de datos', data: undefined});}
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
        if(req.user.role == 'Admin'){
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
    if(!req.user || req.user.role !='Admin'){return res.status(500).send({message: 'NoAccess'}); }
    
    var data = req.body;

    bcrypt.hash('123456789',null,null, async function(err,hash){
        if(hash){
            data.password = hash;
            let reg = await Cliente.create(data);
            res.status(200).send({data:reg});
        }else{
            res.status(200).send({message:'Hubo un error en el servidor',data:undefined});
        }
    });
}


const obtener_cliente_admin = async function (req,res){
    if(req.user){
        if(req.user.role =='Admin'){
            
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
        if(req.user.role =='Admin'){
            
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
        if(req.user.role =='Admin'){
            
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
        }
       
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}
/********************************************************* */
//DiRECIONES


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
    if(id == "undefined"){
        
        return;
    }
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
    registro_direccion_cliente,
    obtener_direccion_todos_cliente,
    cambiar_direccion_principal_cliente,
    obtener_direccion_principal_cliente,
    eliminar_direccion_cliente,
    listar_clientes_tienda,
    obtener_variedades_productos_cliente,
    obtener_productos_slug_publico,
    listar_productos_recomendados_publico,
}