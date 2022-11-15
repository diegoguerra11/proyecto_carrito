import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { ValidatonsCliente } from 'src/app/validations/validationsCliente';
import { ValidatonsIniciarSesion } from 'src/app/validations/validationsIniciarSesion';
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

  ngOnInit(): void { /* TODO Generación automática de Login, innecesaria implementación de código */ 
    //inicio de sesión 
    MessageBox.messageWelcome("Bienvenido, Inicie Sesión o Regístrese");


  }

  login(loginForm:any) {
    if(!ValidatonsIniciarSesion.login(loginForm.form.value)){return;}

    let data = {
      email: this.user.email,
      password: this.user.password
    }

    let productos = localStorage['cart'] ? JSON.parse(localStorage['cart']) : undefined;

    this._clienteService.login_cliente(data).subscribe(
      (response: any)=>{
        console.log(response);
        if(response.data == undefined){return MessageBox.messageError(response.message);}

        this.usuario = response.data;

        localStorage.setItem('token', response.token);
        localStorage.setItem('_id', response.data._id);

        if(productos){
          this.registrarProductos(
            localStorage.getItem('_id'),
            productos,
            localStorage.getItem('token')
          );
        }
        this._router.navigate(['/']);
      },
      (error: any)=>{console.log(error);}
    );
  }

  // registra los productos segun el producto, cliente, cantidad y variedad en el carrito
  registrarProductos(cliente: any, productos: any, token: any){ 
    productos.map((producto: any) => {
      let data = {
        producto: producto.producto._id,
        cliente:  cliente, 
        cantidad: producto.cantidad,
        variedad: producto.variedad.id,
      }

      this._clienteService.agregar_carrito_cliente(data, token).subscribe(
        error => {console.log(error);}
      )
    });
  }

  // registra al cliente por email y contraseña, los guarda en la base de datos y muestra mensaje satisfactorio
  registrar(loginForm:any) {

    if(!ValidatonsCliente.registrarCliente(loginForm.form.value)){return;}

    this._clienteService.registro_cliente(this.cliente).subscribe(
      response => {
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
