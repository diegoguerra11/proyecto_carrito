let Carrito = require('../models/carrito');
let Variedad = require('../models/Variedad');

const agregar_carrito_cliente = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;

    let existe_en_carrito = await Carrito.exists({
        cliente:data.cliente,
        producto:data.producto
    });

    if(existe_en_carrito){
        return res.status(200).send({message: 'Producto agregado anteriormente', data:undefined});
    }

    let reg = await Carrito.create(data);

    return res.status(200).send({data:reg});
}

const comprobar_carrito_cliente = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    try {
        let detalles = req.body.detalles;
        let access = false;
        let producto_sl = '';

        for(let item of detalles){
            let variedad = await Variedad.findOne({producto: item.producto, valor: item.variedad}).populate('producto');
            if(variedad.stock < item.cantidad){
                access = true;
                producto_sl = variedad.producto.titulo;
            }
        }

        if(access){
            return res.status(200).send({venta:false,message:'Stock insuficiente para ' + producto_sl});
        }

        return res.status(200).send({venta:true});
    } catch (error) {
        console.log(error);
    }
}

const obtener_carrito_cliente = async function(req,res){
    if(!req.user){res.status(500).send({message: 'NoAccess'}); return;}
    
    let id = req.params['id'];

    let carrito_cliente = await Carrito.find({cliente:id}).populate('variedad').populate('producto');
    
    res.status(200).send({data:carrito_cliente});
}

const actualizar_cantidad_carrito_cliente = async function(req, res) {
    if(!req.user){res.status(500).send({message: 'NoAccess'}); return;}

    let id = req.param['id'];
    let cantidad = req.param['cantidad'];

    let filter = {_id: id};
    let newvalues = { $set: { cantidad: cantidad} };

    let carrito_cliente = await Carrito.updateOne(filter, newvalues);

    res.status(200).send({data: carrito_cliente});
}

const eliminar_carrito_cliente = async function(req,res){
    if(!req.user){res.status(500).send({message: 'NoAccess'}); return;}
    
    let id = req.params['id'];

    let reg = await Carrito.findByIdAndRemove({_id:id});
    res.status(200).send({data:reg});
}

module.exports = {
    agregar_carrito_cliente,
    comprobar_carrito_cliente,
    actualizar_cantidad_carrito_cliente,
    obtener_carrito_cliente,
    eliminar_carrito_cliente
}