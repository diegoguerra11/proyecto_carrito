'use strict'

let express = require('express');
let app = express();
let bodyparser = require('body-parser');
let mongoose = require('mongoose');
let port = process.env.port || 4201;

let server = require('http').createServer(app);
let io = require('socket.io')(server,{
    cors: {"Access-Control-Allow-Origin":'*'}
});

io.on('connection', function(socket){
    socket.on('delete-carrito',function(data){
        io.emit('new-carrito',data);
    });

    socket.on('add-carrito-add',function(data){
        io.emit('new-carrito-add',data);
    });
});

let descuento_route = require('./routes/descuento');
let cliente_route = require('./routes/cliente');
let admin_route = require('./routes/admin');
let producto_route = require('./routes/producto');
let cupon_route = require ('./routes/cupon');
let config_route = require ('./routes/config');
let carrito_route = require ('./routes/carrito');


const cors = require('cors');

mongoose.connect('mongodb://127.0.0.1:27017/tienda',{useUnifiedTopology: true, useNewUrlParser: true},(err,res)=>{
    if(err){
        console.log(err);
        throw err;
    }else{
        server.listen(port,function(){
            console.log('Servidor corriendo en el puerto ' + port);
        });
    }
});
app.use(cors({"Access-Control-Allow-Origin": '*'}));


app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyparser.json({limit: '50mb',extended: true}));

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api',cliente_route);
app.use('/api',admin_route);
app.use('/api',producto_route);
app.use('/api',cupon_route);
app.use('/api',config_route);
app.use('/api',carrito_route);
app.use('/api',descuento_route);


module.exports = app;