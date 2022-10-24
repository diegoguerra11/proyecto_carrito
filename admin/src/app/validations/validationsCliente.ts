import { MessageBox } from '../utils/MessageBox';

export class ValidatonsCliente {
    static verificarCliente(form: any) {      
        let numerico = /^[0-9]+$/;
        const fecha = new Date();
        const añoActual =fecha.getFullYear();
        const mesActual =fecha.getMonth()+1;
        const diaActual =fecha.getDate();
        if(!form.nombres) {
            MessageBox.messageError('El campo nombres es obligatorio');
            return false;
        }

        if(form.nombres.match(numerico)) {
            MessageBox.messageError('El campo nombres debe ser alfabetico');
            return false;
        }
        
        if(form.telefono && !form.telefono.match(numerico)) {
            MessageBox.messageError('El campo telefono debe ser numerico');
            return false;
        }
        if(!form.numeroDocumento.match(numerico)) {
            MessageBox.messageError('El campo Número de Documento debe ser numérico');
            return false;
        }

        if(form.tipoDocumento == ""){
            MessageBox.messageError('Debe seleccionar un tipo de documento');
            return false;
        }
        if(form.tipoDocumento == "dni" && form.numeroDocumento.length != 8){
            MessageBox.messageError('Número de DNI Inválido');
            return false;
        }
        if(form.tipoDocumento == "carnetExtranjeria" && form.numeroDocumento.length != 12){
            MessageBox.messageError('Número de carnet de Extranjería Inválido');
            return false;
        }
        if(form.tipoDocumento == "pasaporte" && form.numeroDocumento.length != 12){
            MessageBox.messageError('Número de pasaporte Inválido');
            return false;
        }
        console.log(añoActual-18);
        //Se puede mejorar ;)
        if(+(form.f_nacimiento.split("-")[0])> (añoActual-18)){
            MessageBox.messageError('Debe tener más de 18 años para poder ser cliente');
            return false;
        }
        console.log("Pasó año");
        if(+(form.f_nacimiento.split("-")[1]) > mesActual){
            MessageBox.messageError('Debe tener más de 18 años para poder ser cliente');
            return false;
        }
        console.log("Pasó mes");
        if(+(form.f_nacimiento.split("-")[2])> diaActual){
            MessageBox.messageError('Debe tener más de 18 años para poder ser cliente');
            return false;
        }
        console.log("Pasó día");
        return true;
    }
}