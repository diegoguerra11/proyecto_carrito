const carrito = require('../models/carrito');
var Carrito = require('../models/carrito');

const agregar_carrito_cliente = async function(req,res){
    if(!req.user) {res.status(500).send({message: 'NoAccess'}); return;}
    
    let data = req.body;

    let carrito_cliente = await Carrito.find({
        cliente:data.cliente,
        producto:data.producto
    });
    
    if(carrito_cliente.length == 0){
        let reg = await Carrito.create(data);
        res.status(200).send({data:reg});
        return;
    }
    
    if(carrito_cliente.length >= 1){
        res.status(200).send({data:undefined}); 
        return;
    }
}

const obtener_carrito_cliente = async function(req,res){
    if(!req.user){res.status(500).send({message: 'NoAccess'}); return;}
    
    let id = req.params['id'];

    let carrito_cliente = await Carrito.find({cliente:id}).populate('producto');
    res.status(200).send({data:carrito_cliente});
}

const actualizar_cantidad_carrito_cliente = async function(req, res) {
    if(!req.user){res.status(500).send({message: 'NoAccess'}); return;}

    let id = req.param['id'];
    let cantidad = req.param['cantidad'];

    var filter = {_id: id};
    var newvalues = { $set: { cantidad: cantidad} };

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
    actualizar_cantidad_carrito_cliente,
    obtener_carrito_cliente,
    eliminar_carrito_cliente
}