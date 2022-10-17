import { MessageBox } from '../Utils/MessageBox';

export class ValidationsDireccion {
    static registrarDireccion(form: any) {      
        let numerico = /^[0-9]+$/;
        
        
        if(!form.numeroDocumento.match(numerico)) {
            MessageBox.messageError('El campo Número de Documento debe ser numérico');
            return false;
        }

        if(!form.zip.match(numerico)) {
            MessageBox.messageError('El campo zip debe ser numérico');
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
        
        

        return true;
    }
}