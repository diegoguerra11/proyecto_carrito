import { from } from 'rxjs';
import { MessageBox } from '../Utils/MessageBox';

export class ValidationsDireccion {
  
  static registrarDireccion(form: any) {
    let numerico = /^[0-9]+$/;

    if(!this.camposRequeridos(form)){return false;}

    if(form.tipoDocumento == "dni" && !form.numeroDocumento.match(numerico)) {
      MessageBox.messageError('El campo numero de documento debe ser numérico');
      return false;
    }
    
    if(form.tipoDocumento == "carnetExtranjeria" && !form.numeroDocumento.match(numerico)) {
      MessageBox.messageError('El campo numero de documento debe ser numérico');
      return false;
    }
    
    if(!form.zip.match(numerico)) {
      MessageBox.messageError('El campo zip debe ser numérico');
      return false;
    }

    if(form.telefono && !form.telefono.match(numerico)) {
      MessageBox.messageError('El campo telefono debe ser numerico');
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

  static camposRequeridos(form: any) {
    if(!form.destinatario) {
      MessageBox.messageError('El campo destinatario es obligatorio');
      return false;
    }
    
    if(!form.tipoDocumento){
      MessageBox.messageError('Debe seleccionar un tipo de documento');
      return false;
    }
    
    if(!form.numeroDocumento) {
      MessageBox.messageError('El campo numero Documento es obligatorio');
      return false;
    }
    
    if(!form.zip) {
      MessageBox.messageError('El campo zip es obligatorio');
      return false;
    }
    
    if(!form.telefono) {
      MessageBox.messageError('El campo telefono es obligatorio');
      return false;
    }

    if(!form.direccion) {
      MessageBox.messageError('El campo dirección es obligatorio');
      return false;
    }

    if(!form.pais) {
      MessageBox.messageError('El campo pais es obligatorio');
      return false;
    }

    return true;
  }
}
