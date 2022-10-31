import { MessageBox } from '../utils/MessageBox';

export class ValidatonsCupon {
    static verificarCupon(form: any) {

        if(!form.codigo) {
          MessageBox.messageError('El campo codigo es obligatorio');
          return false;
      }
      if(!form.tipo ) {
        MessageBox.messageError('El campo tipo es obligatorio');
        return false;
      }
      if(!form.valor ) {
        MessageBox.messageError('El campo valor es obligatorio');
        return false;
      }
      if(!form.limite ) {
        MessageBox.messageError('El campo limite es obligatorio');
        return false;
      }

        if(form.tipo == "Porcentaje" && form.valor <=0) {
        MessageBox.messageError('El porcentaje debe ser mayor que 0');
        return false;
      }

        if(form.tipo == "Porcentaje" && form.valor>=100) {
        MessageBox.messageError('El porcentaje debe ser menor que 100');
        return false;
          }

        if(form.tipo == "Valor Fijo" && form.valor <=0) {
          MessageBox.messageError('El Valor Fijo debe ser mayor que 0');
          return false;
        }
        if(form.tipo == "Valor Fijo" && form.valor>=90) {
          MessageBox.messageError('El Valor Fijo debe ser menor que 90');
          return false;
            }
        if(form.limite<=0) {
          MessageBox.messageError('El limite debe ser mayor que 0');
          return false;
            }

        return true;
    }
   
}
