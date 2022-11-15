import { Component, OnInit } from '@angular/core';
import { CuponService } from '../../../services/cupon.service';
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

  constructor(//inyecta los servidores
    private _cuponService : CuponService,

  ) {//llama al token que se inicialize con el servicio
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    //TODO NO HACE FALTA MÉTODO
  }
//valida el registro de cupones
  registro(registroForm){

    if(!ValidatonsCupon.verificarCupon(registroForm.form.value)){return;}
      this._cuponService.registro_cupon_admin(this.cupon,this.token).subscribe(
        response=>{//si el cupon ya existe saltara un mensaje
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
