import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { MessageBox } from 'src/app/utils/MessageBox';

declare let jQuery:any;
declare let $:any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {

  public producto : any = {};
  public file : any = undefined;
  public imgSelect:any | ArrayBuffer= 'assets/img/01.jpg';
  public config:any = {};
  public token;
  public load_btn = false;
  public config_global : any = {};

  constructor(
    private _productoService : ProductoService,
    private _adminService: AdminService,
    private _router: Router
  ) { 
    this.config = {
      height: 500
    }
    this.token = this._adminService.getToken();
    this._adminService.obtener_config_publico().subscribe(
      response=>{
        this.config_global = response.data;
        console.log(this.config_global);
      }
    )
  }

  ngOnInit(): void {
    // TODO document why this method 'ngOnInit' is empty
  }

  registro(registroForm){
    if(!registroForm.valid) { 
      this.load_btn = false;
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect ='assets/img/01.jpg';
      this.file = undefined;
      return MessageBox.messageError('Los datos del formulario no son validos');
    }
    if (this.file == undefined) {return MessageBox.messageError('Debe subir una portada para registrar');}

    console.log(this.producto);
    console.log(this.file);      
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

  fileChangeEvent(event:any):void{
    if(!(event.target.files && event.target.files[0])){return MessageBox.messageError('No hay un imagen de envio');}

    let file = <File>event.target.files[0]; 

    if(file.size > 4000000){ 
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect ='assets/img/01.jpg';
      this.file = undefined;
      return MessageBox.messageError('La imagen no puede superar los 4MB');
    }

    if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg'){

      const reader = new FileReader();
      reader.onload = e => this.imgSelect = reader.result;
      console.log(this.imgSelect);

      reader.readAsDataURL(file);
      
      $('#input-portada').text(file.name);
      this.file = file;
      
    }else{
      MessageBox.messageError('El archivo debe ser una imagen');
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect ='assets/img/01.jpg';
      this.file = undefined;
    }
    
    console.log(this.file);
  }
}
