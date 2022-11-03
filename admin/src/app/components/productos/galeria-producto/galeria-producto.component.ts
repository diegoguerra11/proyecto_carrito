import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { MessageBox } from 'src/app/utils/MessageBox';
import { v4 as uuidv4 } from 'uuid';


declare let $;

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css']
})
export class GaleriaProductoComponent implements OnInit {

  public producto : any = {};
  public id;
  public token;

  public file : any = undefined;
  public load_btn = false;
  public load_btn_eliminar = false;
  public url;

  constructor(
    //se inyecta los servidores
    private _route : ActivatedRoute,
    private _productoService : ProductoService
  ) { //se obtiene el token
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];

        this.init_data();

      }
    );
  }

  init_data(){//se obtiene el producto
    this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
      response=>{
        if(response.data == undefined){
          this.producto = undefined;
        }else{
          this.producto = response.data;

        }

      },
      error=>{
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    //TODO NO HACE FALTA MÉTODO
  }

  fileChangeEvent(event:any):void{
    let file;//verifica si se envio alguna imagen
    if(event.target.files && event.target.files[0]){
      file = <File>event.target.files[0];

      //si no se encuentra la imagen manda un mensaje
    }else{
     MessageBox.messageError('No hay un imagen de envio');

    }
    if (file.size <= 4000000) {//verifica si el archivo es una imagen y si pesa hasta 4 mb
       if (file.type == 'image/png' || file.type == 'image/webp'|| file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg') {


          this.file = file;

       }else{//si el archivo no es una imagen mandara un mensaje
        MessageBox.messageError('El archivo debe ser una imagen');

        $('#input-img').val('');
        this.file = undefined;
       }
    } else {//si el archivo pesa mas de 4 mb mandara un error
      MessageBox.messageError('La imagen no puede superar los 4MB');
      $('#input-img').val('');
      this.file = undefined;
    }

  }

  subir_imagen(){//se sube una imagen
    if (this.file != undefined) {
      let data = {
        imagen: this.file,
        _id: uuidv4()
      }
      this._productoService.agregar_imagen_galeria_admin(this.id,data,this.token).subscribe(
        response=>{
          this.init_data();
          $('#input-img').val('');
        }
      );

    } else {//si no se selcciona alguna imagen mandara un mensaje
      MessageBox.messageError('Debe seleccionar una imagen para subir');
    }
  }

  eliminar(id){//se elimina una imagen gracias al id
    this.load_btn_eliminar = true;
      this._productoService.eliminar_imagen_galeria_admin(this.id,{_id:id},this.token).subscribe(
        response=>{
          MessageBox.messageSuccess('Se eliminó correctamente la imagen.');

          $('#delete-'+id).modal('hide');
          $('.modal-backdrop').removeClass('show');

          this.load_btn_eliminar = false;

          this.init_data();


        },
        error=>{//en caso de que no se pueda eliminar la imagen saltara un mensaje
          MessageBox.messageError('Ocurrió un error en el servidor.')
          console.log(error);
          this.load_btn = false;
      }
    )
  }
}
