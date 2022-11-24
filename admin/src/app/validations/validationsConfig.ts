import { MessageBox } from '../utils/MessageBox';

export class ValidationsConfig {
    static verificarImagen(file: File) {
        if(file.size >= 4000000){
            MessageBox.messageError('La imagen no puede superar los 4MB ');
            return false;
        }

        let formato_correcto = file.type == 'image/png' || file.type == 'image/webp'|| file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg';
        if(!formato_correcto) {
            MessageBox.messageError('El archivo debe ser una imagen');
            return false;
        }

        return true;
    } 
}
