import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { MessageBox } from 'src/app/Utils/MessageBox';
import { ValidatonsCliente } from '../../validations/validationsCliente';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.css']
})
export class RecuperarContraseniaComponent implements OnInit {

  public user: any = {};
  public estado: string;
  public confirmPassword:any;

  constructor(
    private _clienteService : ClienteService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { 
    this._activatedRoute.params.subscribe(
      params => {
        this.estado = params['estado'];
        if(this.estado == 'confirmado'){
          this.user.email = params['email'];
        }
      }
    )
  }

  ngOnInit(): void {
    // TODO document why this method 'ngOnInit' is empty
  }

  recuperar(recuperarForm:any) {
    this._clienteService.confirmar_correo(this.user).subscribe(
      response => {
        if(!response.data) {return MessageBox.messageError(response.message);}

        MessageBox.messageSuccess('Se envio un enlace a su correo');
      }
    );
  }

  cambiarContrasenia(contraseniaForm:any) {
    if(!ValidatonsCliente.actualizarContrasenia(contraseniaForm.form.value)){return;}
    this._clienteService.cambiar_contrasenia(this.user).subscribe(
      response => {
        if(!response.data) {return MessageBox.messageError('Error inesperado');}
        MessageBox.messageSuccess('Se actualizó correctamente la contrasenia');
        this._router.navigate(['/login']);
      }
    )
  }
}
