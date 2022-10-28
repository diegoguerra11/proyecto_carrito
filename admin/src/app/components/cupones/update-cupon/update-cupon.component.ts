import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';
import { ValidatonsCupon } from 'src/app/validations/validationsCupon';

declare var iziToast;

@Component({
  selector: 'app-update-cupon',
  templateUrl: './update-cupon.component.html',
  styleUrls: ['./update-cupon.component.css']
})
export class UpdateCuponComponent implements OnInit {

  public token;

  public cupon : any = {
    tipo : ''
  };
  public load_btn = false;
  public id;
  public load_data = true;


  constructor(
    private _cuponService : CuponService,
    private _router: Router,
    private _route : ActivatedRoute
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        console.log(this.id);

        this._cuponService.obtener_cupon_admin(this.id,this.token).subscribe(
          response=>{
            if (response.data == undefined) {
              this.cupon = undefined;
              this.load_data = false;
            }else{
              this.cupon = response.data;
              this.load_data = false;
            }
            console.log(this.cupon);

          }
        )
      }
    )
  }

  actualizar(actualizarForm){
    if(!ValidatonsCupon.verificarCupon(actualizarForm.form.value)){return;}
    console.log(this.cupon);
    this.load_btn = true;
    this._cuponService.actualizar_cupon_admin(this.id,this.cupon,  this.token).subscribe(
      response =>{
        iziToast.show({
          title:'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se actualizo correctamente el cupon'
        });
        this.load_btn = false;

        this._router.navigate(['/panel/cupones']);
      }
    );


  }
}
