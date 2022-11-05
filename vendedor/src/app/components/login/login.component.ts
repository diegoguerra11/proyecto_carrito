import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendedorService } from 'src/app/services/vendedor.service';
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
  
  constructor(
    private _vendedorService:VendedorService,
    private _router: Router
  ) {
    this.token = this._vendedorService.getToken();
   }

  ngOnInit(): void {
   
    if(this.token){
      this._router.navigate(['/']); 

    }
  }

  login(loginForm:any){
    if(!ValidatonsIniciarSesion.login(loginForm.form.value)){return;}

    let data={
      email: this.user.email,
      password: this.user.password
    }

    this._vendedorService.login_admin(data).subscribe(
      response =>{
        if(!response.data){return MessageBox.messageError(response.message);}
        
        this.usuario = response.data;

        localStorage.setItem('token',response.token);
        localStorage.setItem('_id',response.data._id);

        this._router.navigate(['/inicio']);

      },
      error=>{
        console.log(error);
      }
    );
  }
}
