import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { ValidatonsCliente } from 'src/app/validations/validationsCliente';
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
  public cliente : any = {};

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

  registrar(loginForm:any) {
    if(!loginForm.valid) {MessageBox.messageError('Debe completar todos los campos'); return;}
    if(!ValidatonsCliente.registrarCliente(loginForm.form.value)){return;}
    
      this._clienteService.registro_cliente(this.cliente).subscribe(
        response =>{
          if(response.data == undefined) {MessageBox.messageError("Cuenta existente"); return;}

          let data = {
            email: this.cliente.email,
            password: this.cliente.password
          }
          
          this._clienteService.login_cliente(data).subscribe(
            response=>{ 
              if(response.data == undefined){MessageBox.messageError(response.message); return;}
      
              this.usuario = response.data;
              localStorage.setItem('token', response.token);
              localStorage.setItem('_id', response.data._id);
              this._router.navigate(['/cuenta/perfil']);
            },
            error=>{console.log(error);}
          );

          this.cliente ={
            genero: '',
            nombres: '',
            apellidos: '',
            f_nacimiento: '',
            telefono: '',
            dni: '',
            email: ''
          }

          MessageBox.messageSuccess("Cliente registrado satisfactoriamente");
        },
        error=>{
          console.log(error);
        }
      );

  }
}