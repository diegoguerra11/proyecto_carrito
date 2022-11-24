import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { MessageBox } from '../../utils/MessageBox';
import { ValidatonsIniciarSesion } from '../../validations/ValidatonsIniciarSesion';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public usuario: any = {};
  public token: any = '';

  constructor(//se inyecta los servidores
    private _adminService:AdminService,
    private _router: Router
  ) {//llama al token que se inicialize con el servicio
    this.token = this._adminService.getToken();
   }

  ngOnInit(): void {

    if(this.token){
      this._router.navigate(['/']);
    }
  }

//se valida los datos del login y si hay algun error en el formulario mandara un mensaje
  login(loginForm){
    //se valida los datos del login y si hay algun error en el formulario mandara un mensaje
    if(!ValidatonsIniciarSesion.login(loginForm.form.value)){return;}

    let data={
      email: this.user.email,
      password: this.user.password
    }

    this._adminService.login_admin(data).subscribe(
      response =>{
        if(response.data == undefined){return MessageBox.messageError(response.message);}

        this.usuario = response.data;

        localStorage.setItem('token',response.token);
        localStorage.setItem('_id',response.data._id);
        localStorage.setItem('rol',response.data.rol);
        localStorage.setItem('usuario', response.data.apellidos+' '+response.data.nombres);

        this._router.navigate(['/inicio']);

      },
      error=>{
        console.log(error);
      }
    );
  }
}
