'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'javierrojas';

exports.auth = function(req,res,next){
    if(!req.headers.authorization){return res.status(403).send({message: 'NoHeaderError'});}

    let token = req.headers.authorization.replace(/['"]+/g,'');

    let segment = token.split('.');

    if(segment.length !=3){return res.status(403).send({message: 'InvalidToken'});}
    
    try {
        let payload = jwt.decode(token,secret);
        
        if(payload.exp <= moment().unix()){
            return res.status(403).send({message: 'TokenExpirado'});
        }

    } catch (error) {
        return res.status(403).send({message: 'InvalidToken'});
    }
    
    req.user = payload;

    next();
}