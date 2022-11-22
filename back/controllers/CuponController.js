
//Declaración de variables.
let Cupon = require('../models/cupon');

//Función para registrar cupones en Admin. El administrador podrá registrar cupones de descuentos y verificar si ya existen.
const registro_cupon_admin = async function (req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAcceess'});}

    let data = req.body;

    let existeCupon = Promise.resolve(Cupon.findOne({codigo:data.codigo.trim()}));

    existeCupon.then((existe) => {
        if(existeCupon){return res.status(200).send({message: 'El cupón ya existe',data: undefined});}

        let crear_cupon = Promise.resolve(Cupon.create(data));
        crear_cupon.then(cupon => {
            res.status(200).send({data:cupon});
        });
    })
 }

 //Función para listar los cupones en Admin. El administrador podrá solicitar la lista de cupones registrados.
 const listar_cupones_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}

    let filtro = req.params['filtro'];

    let  buscar_cupones = Promise.resolve(Cupon.find({codigo: new RegExp(filtro, 'i')}).sort({createdAt: -1}));
    buscar_cupones.then(reg => {
        res.status(200).send({data: reg});
    });
}

//Función para obtener un cupón en Admin. El administrador podrá buscar los cupones registrados en la tienda.
const obtener_cupon_admin = async function (req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    try {
        let buscar_cupon = Promise.resolve(Cupon.findById({_id:id}));
        buscar_cupon.then(reg => {
            res.status(200).send({data:reg});
        })
        .catch(()=> {throw error});
    } catch (error) {
        res.status(200).send({message:'Error en el servidor', data:undefined});
    }
}

//Función para obtener un cupón por parte del cliente. El cliente podrá acceder a un cupón ingresando su código antes de realizar su compra.
const obtener_cupon_cliente = async function (req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let cupon = req.params['cupon'];

    if(cupon == undefined){return;}

    try {
        let buscar_cupon = Promise.resolve(Cupon.findOne({codigo:cupon}));

        buscar_cupon.then(reg => {
            res.status(200).send({data:reg});
        })
        .catch(() => {throw error})

    } catch (error) {
        res.status(200).send({message:'Error en el servidor', data:undefined});
    }
}

//Función para actualizar cupones en Admin. El administrador podrá actualizar los cupones registrados en el sistema.
const actualizar_cupon_admin = async function (req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let data = req.body;
    
    let id = req.params['id'];

    let buscar_cupon = Promise.resolve(Cupon.findByIdAndUpdate({_id:id,},{
        codigo : data.codigo,
        tipo: data.tipo,
        valor: data.valor,
        limite: data.limite
    }));

    buscar_cupon.then(reg => {
        res.status(200).send({data:reg});
    });

}

//Función para eliminar cupones en Admin. El administrador podrá eliminar cupones del sistema.
const eliminar_cupon_admin = async function (req,res){
    if(!req.user) {return res.status(500).send({message: 'NoAccess'});}
    
    let id = req.params['id'];

    let buscar_cupon = Promise.resolve(Cupon.findByIdAndRemove({_id:id}));
    buscar_cupon.then(reg => {
        res.status(200).send({data:reg});
    });
}

//Función para validar cupones. El cupón debe estar registrado en el sistema para que pueda ser validado, restringiendo también la cantidad máxima de canjes.
const validar_cupon_admin = async function(req,res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let cupon = req.params['cupon'];
    
    let buscar_cupon = Promise.resolve(Cupon.findOne({codigo:cupon}));
    buscar_cupon.then(data => {
            
        if(!data){return res.status(200).send({data:undefined,message: 'El cupón no existe'});}
        
        if(data.limite == 0) {return res.status(200).send({data:undefined,message: 'Se superó el limite máximo de canjes'});}

        res.status(200).send({data:data});
    });
}

//Función para reducir la cantidad de cupones canjeados. El cliente podrá reducir la cantidad de cupones canjeados.
const disminuir_cupon = async function(req, res){
    if(!req.user){return res.status(500).send({message: 'NoAccess'});}
    
    let cupon = req.params['cupon'];

    if(cupon == undefined){return;}

    let buscar_cupon = Promise.resolve(Cupon.findOne({codigo:cupon}));

    buscar_cupon.then(data => {
        if(data){
            let id = data._id;
            let actualiza_cupon = Promise.resolve(Cupon.findByIdAndUpdate({_id:id,},{
                codigo : data.codigo,
                tipo: data.tipo,
                valor: data.valor,
                limite: (data.limite -1)
                
            })); 

            actualiza_cupon.then(reg => {
                res.status(200).send({data:reg});    
            });
        }
    });
}

//Exportación de las funciones.
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