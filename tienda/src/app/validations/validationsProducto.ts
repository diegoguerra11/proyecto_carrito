import { MessageBox } from '../Utils/MessageBox';

export class ValidationsProducto {
   
    static agregarAcarrito(carrito_data: any, obj_variedad_select: any) {   
        let numerico = /\d+(\d+)?/;

        if(!obj_variedad_select.variedad){
            MessageBox.messageError('Seleccione una talla de producto.');
            return false; 
        }

        if(!carrito_data.cantidad.toString().match(numerico)) {
            MessageBox.messageError('El campo Cantidad debe ser numerico');
            return false;
        }

        if(carrito_data.cantidad < 1 || carrito_data.cantidad > 99) {
            MessageBox.messageError('Ingrese una cantidad mayor 0 y menor 100');
            return false;
        }
    
        if(carrito_data.cantidad > parseInt(obj_variedad_select.stock)) {
            MessageBox.messageError('La cantidad disponible es: ' + obj_variedad_select.stock);
            return false;
        }

        return true;
    }

    static agregarStock(stock: any){ 
        let numerico = /\d+(\d+)?/;

        if(!stock){
            MessageBox.messageError('Coloque una cantidad');
            return false;
        }

        if(!stock.toString().match(numerico)){
            MessageBox.messageError('El campo cantidad debe ser numerico');
            return false;
        }
        
        if(stock <= 0){
            MessageBox.messageError('La cantidad disponible debe ser mayor a 0');
            return false;
        }

        if(parseInt(stock) < 1 || parseInt(stock) > 99) {
            MessageBox.messageError('Ingrese una cantidad mayor 0 y menor 100');
            return false;
        }
        return true;
    }
}