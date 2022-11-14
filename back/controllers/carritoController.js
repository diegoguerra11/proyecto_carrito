let Carrito = require('../models/carrito');
let Variedad = require('../models/Variedad');

const agregar_carrito_cliente = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;

    let existe_en_carrito = Promise.resolve(Carrito.exists({
        cliente:data.cliente,
        variedad:data.variedad
    }));

    existe_en_carrito.then(existe => {
        if(existe){return res.status(200).send({message: 'Producto agregado anteriormente', data:undefined});}

        let crear_carrito = Promise.resolve(Carrito.create(data));

        crear_carrito.then(reg => {
            return res.status(200).send({data:reg});
        });
    });
}

const comprobar_carrito_cliente = async function(req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    try {
        let detalles = req.body.detalles;
        let access = false;
        let producto_sl = '';

        for(let item of detalles){
            let buscar_var = Promise.resolve(Variedad.findById({_id: item.variedad}).populate('producto'));
            buscar_var.then(variedad => {
                if(variedad.stock < item.cantidad){
                    access = true;
                    producto_sl = variedad.producto.titulo;
                }
            });
        }

        if(access){return res.status(200).send({venta:false,message:'Stock insuficiente para ' + producto_sl});}

        return res.status(200).send({venta:true});
    } catch (error) {
        console.log(error);
    }
}

const obtener_carrito_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let buscar_carrito_cliente = Promise.resolve(Carrito.find({cliente:id}).populate('variedad').populate('producto'));

    buscar_carrito_cliente.then(carrito_cliente => {
        res.status(200).send({data:carrito_cliente});
    });
}

const actualizar_cantidad_carrito_cliente = async function(req, res) {
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let id = req.params['id'];
    let cantidad = req.params['cantidad'];

    let filter = {_id: id};
    let newvalues = { $set: { cantidad: cantidad} };

    let buscar_carrito = Promise.resolve(Carrito.findById(filter));

    try {
        buscar_carrito.then(item => {
            let buscar_variedad = Promise.resolve(Variedad.findById({_id: item.variedad}));
    
            buscar_variedad.then(variedad => {
                if(variedad.stock < cantidad) {return res.status(200).send({message: 'La cantidad colocada es mayor al stock del producto'});}
                let actualizar_carrito_cliente = Promise.resolve(Carrito.findByIdAndUpdate(filter, newvalues));
    
                actualizar_carrito_cliente.then(carrito_cliente => {
                    res.status(200).send({data: carrito_cliente});
                }).catch(error => {throw error;})
            }).catch(error => {throw error;})
        }).catch(error => {throw error;});

    } catch(error) {
        return res.status(500).send({message: 'Error en el servidor'});
    }
}

const eliminar_carrito_cliente = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let buscar_carrito_cliente = Promise.resolve(Carrito.findByIdAndRemove({_id:id}));

    buscar_carrito_cliente.then(carrito_cliente => {
        res.status(200).send({data:carrito_cliente});
    })

}

module.exports = {
    agregar_carrito_cliente,
    comprobar_carrito_cliente,
    actualizar_cantidad_carrito_cliente,
    obtener_carrito_cliente,
    eliminar_carrito_cliente
}