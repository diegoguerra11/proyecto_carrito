import { Component, OnInit } from '@angular/core';
import { VendedorService } from 'src/app/services/vendedor.service';

import { MessageBox } from 'src/app/utils/MessageBox';

declare let $:any;

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})
export class IndexClienteComponent implements OnInit {

    public clientes : Array<any>=[];
    public filtro_apellidos= '';
    public filtro_correo= '';

    public page=1;
    public pageSize = 20;
    public token;
    public load_data = true;

  constructor(
    private _vendedorService : VendedorService,
  ) {  
    this.token = this._vendedorService.getToken();
   }

  ngOnInit(): void {
    this.init_Data();
  }

  init_Data(){
    this._vendedorService.listar_clientes_filtro_admin(null,null,this.token).subscribe(
      response=>{
        
        this.clientes = response.data;
        this.load_data =false;
      },
      error=>{
        console.log(error);
      }
    );
  }

  filtro(tipo:any){

    if(tipo == 'apellidos'){
     if(this.filtro_apellidos){
      this.load_data=true;
      this._vendedorService.listar_clientes_filtro_admin(tipo,this.filtro_apellidos,this.token).subscribe(
        response=>{
          
          this.clientes = response.data;
          this.load_data =false;
        },
        error=>{
          console.log(error);
        }
      );
     }else{
      this.init_Data();
     }
    }else if(tipo == 'correo'){
      if(this.filtro_correo){
        this.load_data=true;
        this._vendedorService.listar_clientes_filtro_admin(tipo,this.filtro_correo,this.token).subscribe(
          response=>{
            
            this.clientes = response.data;
            this.load_data =false;
          },
          error=>{
            console.log(error);
          }
        );
      }else{
        this.init_Data();
      }
    }

  }


  desactivar(id:any){
    this._vendedorService.desactivar_cliente_vendedor(id,this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('Se desactivo correctamente el cliente.')
        

        $('#disable-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.init_Data();

        
      },
      error=>{
        console.log(error);
      }
    )
  }


  activar(id:any){
    this._vendedorService.activar_cliente_vendedor(id,this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('Se activo correctamente el cliente.')
        

        $('#enable-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.init_Data();

        
      },
      error=>{
        console.log(error);
      }
    )
  }
}
