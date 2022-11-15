import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidatonsCliente } from 'src/app/validations/validationsCliente';
import { MessageBox } from 'src/app/utils/MessageBox';
import { VendedorService } from 'src/app/services/vendedor.service';


@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})

export class CreateClienteComponent implements OnInit {

  public cliente: any = {
    genero: ''
  };
  public token;
  public load_btn = false;

  constructor(
    private _vendedorService: VendedorService,
    private _router: Router
  ){
    this.token = this._vendedorService.getToken();
  }

  ngOnInit(): void {
    
    // TODO No hace falta iniciar con métodos 
  }

  registro(registroForm:any){
    if(!ValidatonsCliente.verificarCliente(registroForm.form.value)){return;}

    this._vendedorService.registro_cliente_admin(this.cliente,this.token).subscribe(
      response =>{
        if(!response.data){
          this.load_btn = false;
          return MessageBox.messageError("El numero documento ya existe");
        }
        MessageBox.messageSuccess("Cliente registrado satisfactoriamente");

        this.cliente ={
          genero: '',
          nombres: '',
          apellidos: '',
          f_nacimiento: '',
          telefono: '',
          dni: '',
          email: ''
        }
        this.load_btn = false;
        this._router.navigate(['/panel/clientes']);
      },
      error=>{
        console.log(error);
      }
    );
  }
}
