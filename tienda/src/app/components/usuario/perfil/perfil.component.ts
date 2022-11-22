import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { MessageBox } from '../../../../../../admin/src/app/utils/MessageBox';
import { ValidatonsCliente } from '../../../validations/validationsCliente';

declare var $:any;


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public cliente: any = {};
  public id;
  public newPassword: string;
  public token;

  constructor(
    private _clienteService: ClienteService,
  ) { 
    this.id = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');

    if (this.id) {
      this._clienteService.obtener_cliente_guest(this.id,this.token).subscribe(
        response=>{
          console.log(response);
          this.cliente = response.data;
        }
      );
    }
  }

  ngOnInit(): void {
    //TODO INNECESARIO
  }

  actualizar(actualizarForm:any){ 
    if(!ValidatonsCliente.actualizarCliente(actualizarForm.form.value)){return;}

    this.cliente.password = this.newPassword;
    
    this._clienteService.actualizar_perfil_cliente_guest(this.id,this.cliente,this.token).subscribe(
      response=>{return MessageBox.messageSuccess('Se actualizo su perfil correctamente.');}
    );
  }
}
