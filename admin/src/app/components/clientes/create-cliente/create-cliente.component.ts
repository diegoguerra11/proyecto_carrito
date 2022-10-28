import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { ValidatonsCliente } from 'src/app/validations/validationsCliente';
import { MessageBox } from 'src/app/utils/MessageBox';


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
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
  }

  registro(registroForm){

      if(!ValidatonsCliente.verificarCliente(registroForm.form.value)){return;}

      console.log(this.cliente);

      this._clienteService.registro_cliente_admin(this.cliente,this.token).subscribe(
        response =>{
          if(!response.data){
            this.load_btn = false;
            return MessageBox.messageError("El numero documento ya existe");}
          console.log(response);
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
