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
      this._cuponService.registro_cupon_admin(this.cupon,this.token).subscribe(
        response=>{
          if(!response.data){return MessageBox.messageError("El codigo del cupon ya existe");}
        MessageBox.messageSuccess("Cupón registrado correctamente");
        this.cupon ={
          codigo: '',
          tipo: '',
          valor: '',
          limite: '',
        }
        },
      );
  }
}
