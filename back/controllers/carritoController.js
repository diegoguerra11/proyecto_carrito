
//Declaración de variebles
let Carrito = require('../models/carrito');
let Variedad = require('../models/Variedad');

//Función para que el cliente pueda agregar un producto al carrito y restringir su registro si el producto ya se encuentra agregado.
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

//Función para comprobar los productos en el carrito. En caso un producto no cuente con stock suficiente de acuerdo a la cantidad que el cliente desee comprar, el sistema
//no procesará la venta.
const comprobar_carrito_cliente = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    try {
        let detalles = req.body.detalles;
        let access = false;
        let producto_sl = '';

        for(let item of detalles){
            let variedad = await Variedad.findById({_id: item.variedad}).populate('producto');
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

//Función para obtener el carrito con los productos agregados. Los productos se mostrarán con las cantidades y detalles como la variedad.
const obtener_carrito_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let carrito_cliente = await Carrito.find({cliente:id}).populate('variedad').populate('producto');
    
    res.status(200).send({data:carrito_cliente});
}

//Función para modificar la cantidad de unidades de un producto en el carrito. El cliente podrá modificar las cantidades de acuerdo al stock actual.
const actualizar_cantidad_carrito_cliente = async function(req, res) {
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.param['id'];
    let cantidad = req.param['cantidad'];

    let filter = {_id: id};
    let newvalues = { $set: { cantidad: cantidad} };

    let carrito_cliente = await Carrito.updateOne(filter, newvalues);

    res.status(200).send({data: carrito_cliente});
}

//Función para eliminar un producto del carrito. El cliente podrá eliminar los productos que desse del carrito.
const eliminar_carrito_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let reg = await Carrito.findByIdAndRemove({_id:id});
    res.status(200).send({data:reg});
}

//Exportación de las funciones.
module.exports = {
    agregar_carrito_cliente,
    comprobar_carrito_cliente,
    actualizar_cantidad_carrito_cliente,
    obtener_carrito_cliente,
    eliminar_carrito_cliente
}