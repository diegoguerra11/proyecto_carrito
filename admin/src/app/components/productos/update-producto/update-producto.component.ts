import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { GLOBAL } from '../../../services/GLOBAL';
import { AdminService } from '../../../services/admin.service';
import { MessageBox } from 'src/app/utils/MessageBox';

declare let $:any;

@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  styleUrls: ['./update-producto.component.css']
})
export class UpdateProductoComponent implements OnInit {

  public producto:any = {};
  public config:any = {};
  public imgSelect! : string | ArrayBuffer;
  public load_btn = false;
  public id;
  public token;
  public url;
  public file : File = undefined!;
  public config_global: any = {};

  constructor(
    private _route : ActivatedRoute,
    private _productoService: ProductoService,
    private _adminService: AdminService,
    private _router : Router
  ){ 
    this.config = {
      height: 500
    }
    this.token = localStorage.getItem('token') || [];
    this.url = GLOBAL.url;
    this._adminService.obtener_config_publico().subscribe(
      response => {
        this.config_global = response.data;
      
        
      }
    )
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params ['id'];
       
        this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;
              this.imgSelect = this.url + 'obtener_portada/' + this.producto.portada;
            }
          },
          error => {
            console.log(error);
            
          }     
        );
        
      }
    );
  }

  actualizar(actualizarForm){
    if(actualizarForm.valid){
      
      let data : any = {};

      if(this.file != undefined){
        data.portada = this.file;
      }

        data.titulo = this.producto.titulo;
        data.stock = this.producto.stock;
        data.precio = this.producto.precio;
        data.categoria = this.producto.categoria;
        data.descripcion = this.producto.descripcion;
        data.contenido = this.producto.contenido;

      this.load_btn = true;
      this._productoService.actualizar_producto_admin(data, this.id, this.token).subscribe(
        response => {
          
          MessageBox.messageSuccess('Se actualizó correctamente el nuevo producto');

          this.load_btn = false;
          this._router.navigate(['/panel/productos']);
        },
        error => {
          console.log(error);
          this.load_btn = false;
          
        }
      )

    }else{
      MessageBox.messageError('Los datos del formulario no son válidos');
      this.load_btn = false;
    }
  }

  fileChangeEvent(event:any):void{
    let file;
    if(event.target.files && event.target.files[0]){
      file = <File>event.target.files[0];

    }else{
      MessageBox.messageError('No hay un imagen de envío');
    }

    if(file.size <= 4000000){
      if(file.type == 'image/png' || file.type == 'image/webp'|| file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg'){

        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result!;
       

        reader.readAsDataURL(file);
          
        $('#input-portada').text(file.name);
        this.file = file;
        
      }else{
        MessageBox.messageError('El archivo debe ser una imagen');
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect ='assets/img/01.jpg';
        this.file = undefined!;
       }

    }else{
      MessageBox.messageError('La imagen no puede superar los 4 MB');
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect ='assets/img/01.jpg';
      this.file = undefined!;
    } 
    
    
  }
}
