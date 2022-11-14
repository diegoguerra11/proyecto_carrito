import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { GLOBAL } from '../../../services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { MessageBox } from '../../../utils/MessageBox';
declare let $:any;
@Component({
  selector: 'app-variedad-producto',
  templateUrl: './variedad-producto.component.html',
  styleUrls: ['./variedad-producto.component.css']
})
export class VariedadProductoComponent implements OnInit {

  public producto : any = {};
  public id;
  public token;
  public variedades :Array<any> = [];
  public load_agregar = false;
  public load_data = true;
  public stock = 0;
  public nueva_variedad = '';
  public load_btn = false;
  public url;
  public load_del = false;
  constructor(//inyecta los servidores
    private _route : ActivatedRoute,
    private _productoService : ProductoService,
    private _adminService : AdminService
  ){ //llama al token que se inicialize con el servicio
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
 //obtiene los productos
        this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
            if(response.data == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;
            }


          },
          error=>{console.log(error);}
        );

      }
    );
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        this.load_data = true;
        this.listar_variedades();

      }
    );
  }
//lista las variedades
  listar_variedades(){
    this._adminService.listar_variedades_admin(this.id,this.token).subscribe(
      response=>{
        this.variedades = response.data;
        this.load_data = false;
      }
    );
  }
//verifica la variedad agregada y si la validacion encuentra un error saltara un mensaje
  agregar_variedad(){
    if(!this.nueva_variedad){
      return MessageBox.messageError('El campo de la variedad debe ser completado');
    }
//obtiene los datos del index del html
    let data = {
      producto: this.id,
      valor:this.nueva_variedad,
      stock: this.stock
    }
//si todo esta correcto saltara un mensaje
    this.load_agregar = true;
    this._adminService.agregar_nueva_variedad_admin(data,this.token).subscribe(
      response=>{

        MessageBox.messageSuccess('Se agregó la nueva variedad');
        this.load_agregar = false;
        this.listar_variedades();
      }
    );

    this.nueva_variedad = '';
  }
//elimina una variedad
  eliminar_variedad(id:any){
    this.load_del = true;
    this._adminService.eliminar_variedad_admin(id,this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('Se eliminó correctamente la variedad');

        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').remove();
        this.load_del = false;
        this.listar_variedades();

      },
      error=>{//en caso no pueda eliminar saltara un mensajje
        MessageBox.messageError('Ocurrió un error en el servidor');
        console.log(error);
        this.load_btn = false;
      }
    )
  }
//se  actualiza una variedad
  actualizar(){
    if(this.producto.titulo_variedad){

      this.load_btn = true;
      this._adminService.actualizar_producto_variedades_admin({
        titulo_variedad: this.producto.titulo_variedad
      },
      this.id,this.token).subscribe(
        response=>{
          MessageBox.messageSuccess('Se actualizó correctamente las variedades');
          this.load_btn = false;
        }
      );
    }else{//en caso de que falte algo saltara un mensaje
      MessageBox.messageError('Debe completar el título de la variedad');
      this.load_btn = false;
    }
  }

}
