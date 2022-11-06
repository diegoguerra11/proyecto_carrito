import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { AdminService } from '../../../services/admin.service';
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

  constructor(//inyecta los servidores
    private _clienteService : ClienteService,
    private _adminService : AdminService
  ) {  //llama al token que se inicialize con el servicio
    this.token = this._adminService.getToken();
   }

  ngOnInit(): void {
    this.init_Data();
  }
//obtiene la lista de los clientes
  init_Data(){
    this._clienteService.listar_clientes_filtro_admin(null,null,this.token).subscribe(
      response=>{

        this.clientes = response.data;
        this.load_data =false;
      },
      error=>{
        console.log(error);
      }
    );
  }
//filtra los clientes por apellido
  filtro(tipo){

    if(tipo == 'apellidos'){
     if(this.filtro_apellidos){
      this.load_data=true;
      this._clienteService.listar_clientes_filtro_admin(tipo,this.filtro_apellidos,this.token).subscribe(
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
    }else if(tipo == 'correo'){//filtra pór el correo
      if(this.filtro_correo){
        this.load_data=true;
        this._clienteService.listar_clientes_filtro_admin(tipo,this.filtro_correo,this.token).subscribe(
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

//elimina un cliente de la lista y actualiza la lista sin ese cliente eliminado
  eliminar(id){
    this._clienteService.eliminar_cliente_admin(id,this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('Se eliminó correctamente el cliente.')


        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.init_Data();


      },
      error=>{
        console.log(error);
      }
    )
  }

}
