import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { CuponService } from '../../../services/cupon.service';
import { Router } from '@angular/router';
import { MessageBox } from 'src/app/utils/MessageBox';
import { ValidatonsCupon } from 'src/app/validations/validationsCupon';


@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css']
})
export class CreateCuponComponent implements OnInit {

   public token;

  public cupon : any = {
    tipo : ''
  };
  public load_btn = false;

  constructor(
    private _cuponService : CuponService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
  }

  registro(registroForm){

    if(!ValidatonsCupon.verificarCupon(registroForm.form.value)){return;}
    console.log(this.cupon);
      this.load_btn = true;
      this._cuponService.registro_cupon_admin(this.cupon,this.token).subscribe(
        response=>{
        console.log(response);
        MessageBox.messageSuccess("Cupón registrado correctamente");
        this.cupon ={
          codigo: '',
          tipo: '',
          valor: '',
          limite: '',
        }

        this.load_btn = false;

        this._router.navigate(['/panel/cupones']);
        },
        error => {
        this.load_btn = false;
        console.log(error);
        }
      );









  }

}
