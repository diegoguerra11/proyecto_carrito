import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { MessageBox } from 'src/app/utils/MessageBox';

declare let $:any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {
//vincula los imputs del html con las variables
  public producto : any = {};
  public file : any = undefined;
  public imgSelect:any | ArrayBuffer= 'assets/img/01.jpg';
  public config:any = {};
  public token;
  public load_btn = false;
  public config_global : any = {};

  constructor(
    //se inyecta los sevicios
    private _productoService : ProductoService,
    private _adminService: AdminService,
    private _router: Router
  ) {
    //tiene un alto de 500 pixeles
    this.config = {
      height: 500
    }
    //llama al token que se inicialize con el servicio
    this.token = this._adminService.getToken();
    this._adminService.obtener_config_publico().subscribe(
      response=>{
        this.config_global = response.data;
      }
    )
  }

  ngOnInit(): void {
    // TODO NO HACE FALTA MÉTODO DE INICIO
  }
//recibe el formulario registro y si el formulario no es valido mostrara un mensaje de error
  registro(registroForm){
    if(!registroForm.valid) {
      this.load_btn = false;
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect ='assets/img/01.jpg';
      this.file = undefined;
      return MessageBox.messageError('Los datos del formulario no son validos');
    }
    // verifica si subio una portada
    if (this.file == undefined) {return MessageBox.messageError('Debe subir una portada para registrar');}
    //si todo el formulario esta correcto manda un mensaje y los manda al panel
    this.load_btn = true;
    this._productoService.registro_producto_admin(this.producto,this.file,this.token).subscribe(
      response => {
        MessageBox.messageSuccess('Se registro correctamente el nuevo producto.');
        this.load_btn = false;
        this._router.navigate(['/panel/productos']);
      },
      error=>{
        console.log(error);
        this.load_btn = false;
      }
    );
  }
//obtiene la imagen directo del imput
  fileChangeEvent(event:any):void{
    //verifica sui hay una imagen y de caso contrario mandara un mensaje
    if(!(event.target.files && event.target.files[0])){return MessageBox.messageError('No hay un imagen de envio');}
//en la variable file guarda el archibo
    let file = <File>event.target.files[0];

//verifica que la imagen no pese mas de 4 mb
    if(file.size > 4000000){
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect ='assets/img/01.jpg';
      this.file = undefined;
      return MessageBox.messageError('La imagen no puede superar los 4MB');
    }
//verifica que sea una imagen
    if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg'){

      const reader = new FileReader();
      reader.onload = e => this.imgSelect = reader.result;

      reader.readAsDataURL(file);

      $('#input-portada').text(file.name);
      this.file = file;

    }else{//si no es una imagen manda un mensaje
      MessageBox.messageError('El archivo debe ser una imagen');
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect ='assets/img/01.jpg';
      this.file = undefined;
    }

  }
}
