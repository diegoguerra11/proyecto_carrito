import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { MessageBox } from '../../Utils/MessageBox';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
 
  public user : any = {};
  public usuario : any = {};
  public token;

  constructor(
    private _clienteService: ClienteService,
    private _router : Router
  ) { 
    this.token = localStorage.getItem('token');
    
    if(this.token){this._router.navigate(['/']);}
  }

  ngOnInit(): void {}

  login(loginForm:any) {
    if(!loginForm.valid) {MessageBox.messageError('Los datos del formulario no son validos'); return;}

    let data = {
      email: this.user.email,
      password: this.user.password
    }
    
    this._clienteService.login_cliente(data).subscribe(
      response=>{ 
        if(response.data == undefined){MessageBox.messageError(response.message); return;}

        this.usuario = response.data;
        localStorage.setItem('token', response.token);
        localStorage.setItem('_id', response.data._id);

        this._router.navigate(['/']);
      },
      error=>{console.log(error);}
    );
  }
}