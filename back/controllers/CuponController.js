let Cupon = require('../models/cupon');

const registro_cupon_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAcceess'});}

    let data = req.body;

    let existeCupon = await Cupon.findOne({codigo:data.codigo.trim()});
    
    if(existeCupon){return res.status(200).send({message: 'El cupón ya existe',data: undefined});}

    let reg = await Cupon.create(data);
    res.status(200).send({data:reg});
 }

 const listar_cupones_admin = async function(req,res){
    if(!req.user || req.user.role != 'admin'){return res.status(500).send({message: 'NoAccess'});}

    let filtro = req.params['filtro'];

    let reg = await Cupon.find({codigo: new RegExp(filtro, 'i')}).sort({createdAt: -1});
    res.status(200).send({data: reg});
}

const obtener_cupon_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    try {
        let reg = await Cupon.findById({_id:id});

        res.status(200).send({data:reg});
    } catch (error) {
        res.status(200).send({message:'Error en el servidor', data:undefined});
    }
}

const obtener_cupon_cliente = async function (req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let cupon = req.params['cupon'];

    if(cupon == undefined){return;}

    try {
        let reg = await Cupon.findOne({codigo:cupon});

        res.status(200).send({data:reg});
    } catch (error) {
        res.status(200).send({message:'Error en el servidor', data:undefined});
    }
}

const actualizar_cupon_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;
    
    let id = req.params['id'];

    let reg = await Cupon.findByIdAndUpdate({_id:id,},{
        codigo : data.codigo,
        tipo: data.tipo,
        valor: data.valor,
        limite: data.limite
    });

    res.status(200).send({data:reg});
}

const eliminar_cupon_admin = async function (req,res){
    if(!req.user || req.user.role != 'admin') {return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let reg = await Cupon.findByIdAndRemove({_id:id});
    res.status(200).send({data:reg});
}

const validar_cupon_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let cupon = req.params['cupon'];
    
    let data = await Cupon.findOne({codigo:cupon});
    
    if(!data){return res.status(200).send({data:undefined,message: 'El cupón no existe'});}
    
    if(data.limite == 0) {return res.status(200).send({data:undefined,message: 'Se superó el limite máximo de canjes'});}

    res.status(200).send({data:data});
}

const disminuir_cupon = async function(req, res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let cupon = req.params['cupon'];

    if(cupon == undefined){return;}

    let data = await Cupon.findOne({codigo:cupon});

    let id = data._id;
    let reg = await Cupon.findByIdAndUpdate({_id:id,},{
        codigo : data.codigo,
        tipo: data.tipo,
        valor: data.valor,
        limite: (data.limite -1)
    });

    res.status(200).send({data:reg});     
}

module.exports = {
    registro_cupon_admin,
    listar_cupones_admin,
    obtener_cupon_admin,
    actualizar_cupon_admin,
    eliminar_cupon_admin,
    validar_cupon_admin,
    disminuir_cupon,
    obtener_cupon_cliente
}