'use strict'

//Creación de variables.
let nodemailer = require("nodemailer");
let fs = require('fs');
let ejs = require('ejs');
let handlebars = require('handlebars');

//Función para verificación del correo al momento de realizar una compra.
exports.enviar_correo = function (orden, dventa, plantilla, subject) {
    try {
        let readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    callback(err);
                    throw err;
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        let transporter = nodemailer.createTransport(({
            secure: true,
            requireTLS: true,
            port: 465,
            secured: true,
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'renzo.carrascom@gmail.com',
                pass: 'mjqzblcffaegvdzm'
            }
        }));
    
        readHTMLFile(process.cwd() + plantilla, (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            let template = handlebars.compile(rest_html);
            let htmlToSend = template({op:true});
    
            let mailOptions = {
                from: 'renzo.carrascom@gmail.com',
                to: orden.cliente.email,
                subject: subject,
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
}
