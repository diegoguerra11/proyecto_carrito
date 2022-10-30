import { MessageBox } from '../utils/MessageBox';

export class ValidatonsVenta {
    static verificarVenta(form: any) {

      if(!form.filtro_cliente) {
        MessageBox.messageError('El campo cliente es obligatorio');
        return false;
      }
        return true;
    }

}
