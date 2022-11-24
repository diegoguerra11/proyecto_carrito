import { Component, OnInit } from '@angular/core';
import { MessageBox } from 'src/app/utils/MessageBox';
import { CuponService } from '../../../services/cupon.service';
declare let $:any;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {


    public cupones : Array<any> = [];
    public load_data  = true;
    public page=1;
    public pageSize = 20;
    public filtro = '';
    public token;


  constructor(//se inyecta los servidores
    private _cuponService : CuponService
  ) { //llama al token que se inicialize con el servicio
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
   this.filtrar();
  }
//se lista los cupones
  filtrar(){
    this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
      response=>{
        this.cupones = response.data;
        this.load_data = false;
      }
    )
  }
 
  //se desactivo un cupon
  desactivar(id){
    this._cuponService.desactivar_cupon_admin(id, this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('Se desactivo correctamente el cupon.');

        $('#disable-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
          response=>{
            this.cupones = response.data;
            this.load_data = false;
          }
        )


      },
      error=>{
        console.log(error);
      }
    )
  }

  //se activo un cupon
  activar(id){
    this._cuponService.activar_cupon_admin(id, this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('Se activo correctamente el cupon.');

        $('#enable-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
          response=>{
            this.cupones = response.data;
            this.load_data = false;
          }
        )
      },
      error=>{
        console.log(error);
      }
    )
  }

}
