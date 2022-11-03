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

  constructor(//iunyecta los servidores
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _router: Router
  ){//llama al token que se inicialize con el servicio
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {

    // TODO No hace falta iniciar con métodos
  }
//regitra los clientes y valida que los datos esten correctos
  registro(registroForm){
    if(!ValidatonsCliente.verificarCliente(registroForm.form.value)){
      return;
    }
//verifica si el documento ya existe en la base de datos
    this._clienteService.registro_cliente_admin(this.cliente,this.token).subscribe(
      response =>{
        if(!response.data){
          this.load_btn = false;//si el documento ya existe saltara un mensaje
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
