import { MessageBox } from '../Utils/MessageBox';

export class ValidatonsIniciarSesion {
    static login(form: any) {
      let esCorreo = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

      if(!form.email) {
        MessageBox.messageError('El campo email es obligatorio');
        return false;
      }

      if(!form.password) {
        MessageBox.messageError('El campo contraseña es obligatorio');
        return false;
      }
      
      if(!form.email.match(esCorreo)) {
        MessageBox.messageError('Debe Ingresar un correo electrónico válido');
        return false;
      }

      return true;
    }
}
