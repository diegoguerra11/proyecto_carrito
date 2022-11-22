import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { v4 as uuidv4 } from 'uuid';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { MessageBox } from '../../utils/MessageBox';
import { ValidationsConfig } from '../../validations/validationsConfig';

declare let $:any;

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})

export class ConfigComponent implements OnInit {

  public token;
  public config :any = {};
  public url;

  public titulo_cat = '';
  public icono_cat = '';
  public file: File =undefined!;
  public imgSelect! : string|ArrayBuffer;

  constructor(
    private _adminService: AdminService
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._adminService.obtener_config_admin(this.token).subscribe(
      response=>{
        this.config = response.data;
        console.log(this.config);
        this.imgSelect = this.url + 'obtener_logo/'+this.config.logo;
        console.log(this.imgSelect);
        console.log(this.url + 'obtener_logo/'+this.config.logo);
      },
      error=>{
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    //TODO VACIO
  }

  agregar_cat(){
    if (this.titulo_cat && this.icono_cat) {
      console.log(uuidv4());
      this.config.categorias.push({
        titulo: this.titulo_cat,
        icono: this.icono_cat,
        _id: uuidv4()
      });
      this.titulo_cat = '';
      this.icono_cat = '';
    } else {
      MessageBox.messageError('Debe ingresar un titulo e icono para la categoria');
    }
  }

  actualizar(confForm){
    if(!confForm.valid){return MessageBox.messageError('Complete correctamente el formulario');}
    
    let data={
      titulo: confForm.value.titulo,
      categorias: this.config.categorias,
      logo: this.file
    }
    console.log(data);
    
    this._adminService.actualizar_config_admin("61abe55d2dce63583086f108",data,this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('Se actualizo correctamente la configuracion.'); 
      }
    );
  }

  fileChangeEvent(event){
    if(!event.target.files || !event.target.files[0]) {return MessageBox.messageError('No hay una imagen de envio');}
  
    let file = <File>event.target.files[0];

    if(!ValidationsConfig.verificarImagen(file)) {
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect ='assets/img/01.jpg';
      this.file = undefined!;
      return;
    }

    const reader = new FileReader();
    reader.onload = e => this.imgSelect = reader.result!;
    $('.cs-file-drop-icon').addClass('cs-file-drop-preview img-thumbnail rounded');
    $('.cs-file-drop-icon').removeClass('cs-file-drop-icon cxi-upload');
    console.log(this.imgSelect);

    reader.readAsDataURL(file);
    
    $('#input-portada').text(file.name);
    this.file = file;
  
    console.log(this.file);    
  }

  ngDoCheck(): void {
    $('.cs-file-drop-preview').html("<img src="+this.imgSelect+">");
  }

  eliminar_categoria(idx){
    this.config.categorias.splice(idx,1);
  }

}
