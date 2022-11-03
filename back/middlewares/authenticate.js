'use strict'

//Declaración de variables.
let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'javierrojas';

//Autenticación de los usuarios mediante tokens.
exports.auth = function(req,res,next){
    if(!req.headers.authorization){return res.status(403).send({message: 'NoHeaderError'});}

    let token = req.headers.authorization.replace(/['"]+/g,'');

    let segment = token.split('.');

    let payload;
    
    if(segment.length !=3){
        return res.status(403).send({message: 'InvalidToken'});
    }
    try {
        payload = jwt.decode(token,secret);
        
        if(payload.exp <= moment().unix()){
            return res.status(403).send({message: 'TokenExpirado'});
        }

    } catch (error) {
        return res.status(403).send({message: 'InvalidToken'});

    }

    req.user = payload;

    next();
}