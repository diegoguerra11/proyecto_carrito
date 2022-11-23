import { MessageBox } from '../Utils/MessageBox';

export class ValidatonsCliente {
    static actualizarCliente(form: any) {
        if(!this.obligatoriosActualizar(form)) {return false};
        if(!this.matches(form)){return false;}

        if(form.newPassword && form.newPassword.length < 8) {
            MessageBox.messageError('La contraseña debe ser minimo de 8 caracteres');
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

        return true;
    }

    static obligatoriosActualizar (form:any) {
        const fecha = new Date(form.f_nacimiento);
        const timeDiff = Math.abs(Date.now() - fecha.getTime());
        if(!form.nombres) {
            MessageBox.messageError('El campo nombres es obligatorio');
            return false;
        }

        if(form.tipoDocumento == ""){
            MessageBox.messageError('Debe seleccionar un tipo de documento');
            return false;
        }
       
        if(Math.floor((timeDiff / (1000 * 3600 * 24))/365) < 18) {
            MessageBox.messageError('Debe tener más de 18 años para poder ser cliente');
            return false;
        }
        return true;
    }

    static matches(form:any) {
        let escontraseña=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%?&])[A-Za-z\d$@$!%?&]{8,15}/;
        let numerico = /^[0-9]+$/;

         
        if(form.newPassword && !form.newPassword.match(escontraseña)) {
            MessageBox.messageError('El campo contraseña debe tener como minimo una mayúscula, un numero y un caracter especial');
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

        if(form.numeroDocumento && !form.numeroDocumento.match(numerico)) { 
            MessageBox.messageError('El campo Número de Documento debe ser numérico');
            return false;
        }

        return true;
    }

    static registrarCliente(form:any){
        let escontraseña=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%?&])[A-Za-z\d$@$!%?&]{8,15}/;
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

        if(form.password.length < 8) {
            MessageBox.messageError('La contraseña debe ser minimo de 8 caracteres');
            return false;
        }

        if(!form.password.match(escontraseña)) {
            MessageBox.messageError('El campo nueva contraseña debe tener como minimo una mayúscula, un numero y un caracter especial');
            return false;
        }

        return true;
    }

    static actualizarContrasenia(form:any) {
        let escontraseña=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%?&])[A-Za-z\d$@$!%?&]{8,15}/;

        if(!form.newPassword){
            MessageBox.messageError('El campo nueva contraseña es obligatorio');
            return false;
        }

        if(form.newPassword.length < 8) {
            MessageBox.messageError('La nueva contraseña debe ser minimo de 8 caracteres');
            return false;
        }

        if(!form.newPassword.match(escontraseña)) {
            MessageBox.messageError('El campo nueva contraseña debe tener como minimo una mayúscula, un numero y un caracter especial');
            return false;
        }

        if(!form.confirmPassword){
            MessageBox.messageError('El campo nueva contraseña es obligatorio');
            return false;
        }

        if(form.newPassword != form.confirmPassword) {
            MessageBox.messageError('La contrsañas no coinciden');
            return false;
        }

        return true;
    }
}
