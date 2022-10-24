import { MessageBox } from '../Utils/MessageBox';

export class ValidatonsCliente {
    static actualizarCliente(form: any) {
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
        //Se puede mejorar ;)
        if(+(form.f_nacimiento.split("-")[0])> (añoActual-18)){
            MessageBox.messageError('Debe tener más de 18 años para poder ser cliente');
            return false;
        }
        if(+(form.f_nacimiento.split("-")[1]) > mesActual){
            MessageBox.messageError('Debe tener más de 18 años para poder ser cliente');
            return false;
        }
        if(+(form.f_nacimiento.split("-")[2])> diaActual){
            MessageBox.messageError('Debe tener más de 18 años para poder ser cliente');
            return false;
        }
        return true;
    }
    static registrarCliente(form:any){
        let numerico = /^[0-9]+$/;
        let esCorreo = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if(!form.nombres){
            MessageBox.messageError('El campo nombre es obligatorio');
            return false;
        }
        if(form.nombres.match(numerico)) {
            MessageBox.messageError('El campo nombre debe ser alfabetico');
            return false;
        }
        if(!form.apellidos){
          MessageBox.messageError('El campo apellido es obligatorio');
          return false;
        }
      if(form.apellidos.match(numerico)) {
          MessageBox.messageError('El campo apellido debe ser alfabetico');
          return false;
        }
      if(!form.email){
        MessageBox.messageError('El campo email es obligatorio');
        return false;
        }
        if(!form.email.match(esCorreo)) {
            MessageBox.messageError('Debe Ingresar un correo electrónico válido');
            return false;
        }
        if(!form.password){
          MessageBox.messageError('El campo password es obligatorio');
          return false;
          }

        return true;

    }
}
