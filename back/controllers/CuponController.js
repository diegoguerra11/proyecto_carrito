let Cupon = require('../models/cupon');

const registro_cupon_admin = async function (req,res){
            if (req.user) {
                if (req.user.role == 'admin') {
                    let data = req.body;
                    let existeCupon = await Cupon.findOne({codigo:data.codigo.trim()});
                    if(existeCupon){
                        res.status(200).send({data: undefined});
                    }else{
                        let reg = await Cupon.create(data);
                        res.status(200).send({data:reg});
                    }
                }else{
                    res.status(500).send({message: 'NoAcceess'});
                }
            } else{
                res.status(500).send({message: 'NoAcceess'});
            }
 }

 const listar_cupones_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            let filtro = req.params['filtro'];
            let reg = await Cupon.find({codigo: new RegExp(filtro, 'i')}).sort({createdAt: -1});
            res.status(200).send({data: reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_cupon_admin = async function (req,res){
    if(req.user){
        if(req.user.role =='admin'){
            let id = req.params['id'];
            try {
                let reg = await Cupon.findById({_id:id});
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

const actualizar_cupon_admin = async function (req,res){
    if(req.user){
        if(req.user.role =='admin'){
            let data = req.body;
            let id = req.params['id'];
            let reg = await Cupon.findByIdAndUpdate({_id:id,},{
                codigo : data.codigo,
                tipo: data.tipo,
                valor: data.valor,
                limite: data.limite
            });
                res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_cupon_admin = async function (req,res){
    if(req.user){
        if(req.user.role =='admin'){
           let id = req.params['id'];
           let reg = await Cupon.findByIdAndRemove({_id:id});
           res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAcceess'});
    }
}

const validar_cupon_admin = async function(req,res){

    if(req.user){
        let cupon = req.params['cupon'];

        let data = await Cupon.findOne({codigo:cupon});

        if(data){
           if(data.limite == 0){
             res.status(200).send({data:undefined,message: 'Se superó el mimite máximo de canjes'});
           }else{
             res.status(200).send({data:data});
           }
        }else{
            res.status(200).send({data:undefined,message: 'El cupón no existe'});
        }

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const disminuir_cupon = async function(req, res){
    if(req.user){
        let cupon = req.params['cupon'];
        if(cupon == undefined){
            return;
        }
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
    else{
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
    registro_cupon_admin,
    listar_cupones_admin,
    obtener_cupon_admin,
    actualizar_cupon_admin,
    eliminar_cupon_admin,
    validar_cupon_admin,
    disminuir_cupon
}