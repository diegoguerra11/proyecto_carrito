import { MessageBox } from '../utils/MessageBox';

export class ValidatonsTrabajador {
    static verificarTrabajador(form: any) {
        let numerico = /^\d+$/;
        
        if(!this.validarObligatorios(form)){return false;}
      
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

    private static validarObligatorios(form: any) {
        if(!form.nombres) {
            MessageBox.messageError('El campo nombres es obligatorio');
            return false;
        }
        if(!form.apellidos) {
            MessageBox.messageError('El campo apellidos es obligatorio');
            return false;
          }
        if(!form.email) {
            MessageBox.messageError('El campo correo electronico es obligatorio');
            return false;
        }
        if(!form.telefono) {
            MessageBox.messageError('El campo telefono es obligatorio');
            return false;
        }
        if(!form.tipoDocumento) {
            MessageBox.messageError('El campo tipo de documento es obligatorio');
            return false;
          }
        if(!form.numeroDocumento) {
            MessageBox.messageError('El campo numero de documento es obligatorio');
            return false;
        }
        if(!form.rol) {
            MessageBox.messageError('El campo rol es obligatorio');
            return false;
        }
        if(!form.password) {
            MessageBox.messageError('El campo contraseña es obligatorio');
            return false;
        }
        return true;
    }
}
