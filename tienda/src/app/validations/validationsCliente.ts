import { MessageBox } from '../Utils/MessageBox';

export class ValidatonsCliente {
    static actualizarCliente(form: any) {      
        let numerico = /^[0-9]+$/;
        
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

        return true;
    }
}