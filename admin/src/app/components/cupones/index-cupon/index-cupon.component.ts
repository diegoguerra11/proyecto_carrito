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


  constructor(
    private _cuponService : CuponService
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
   this.filtrar();
  }

  filtrar(){
    this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
      response=>{
        this.cupones = response.data;
        this.load_data = false;
      }
    )
  }

  eliminar(id){
    this._cuponService.eliminar_cupon_admin(id,this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('Se eliminó correctamente el cliente.');

        $('#delete-'+id).modal('hide');
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
