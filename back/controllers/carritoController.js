let Carrito = require('../models/carrito');
let Variedad = require('../models/Variedad');

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

const comprobar_carrito_cliente = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    try {
        let data = req.body;
        let detalles = data.detalles;
        let access = false;
        let producto_sl = '';
        for(let item of detalles){
            let variedad = await Variedad.find({producto: item.producto, valor: item.variedad}).populate('producto');
            console.log(variedad);
            if(variedad.stock < item.cantidad){
                access = true;
                producto_sl = variedad.producto.titulo;
            }
        }

        if(access){return res.status(200).send({venta:false,message:'Stock insuficiente para ' + producto_sl});}

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