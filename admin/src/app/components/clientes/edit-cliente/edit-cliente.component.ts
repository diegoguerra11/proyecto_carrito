import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { AdminService } from '../../../services/admin.service';
import { ValidatonsCliente } from 'src/app/validations/validationsCliente';
import { MessageBox } from 'src/app/utils/MessageBox';

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {

  public cliente : any = {};
  public id;
  public token;
  public load_btn = false;
  public load_data = true;

  constructor(
    private _route : ActivatedRoute,
    private _clienteService: ClienteService,
    private _adminService : AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        
        this._clienteService.obtener_cliente_admin(this.id,this.token).subscribe(
          response =>{
            this.cliente = response.data ? response.data : undefined
            this.load_data = false;
          },
          error => {
            console.log(error);
          }
        );
      }
    )
  }

  actualizar(updateForm){
    if(!ValidatonsCliente.verificarCliente(updateForm.form.value)){return;}
    this.load_btn = true;
    this._clienteService.actualizar_cliente_admin(this.id,this.cliente,this.token).subscribe(
      response => {  
        MessageBox.messageSuccess("Cliente Actualizado correctamente");       
        this.load_btn = false;
        this._router.navigate(['/panel/clientes']);
      }, error=>{
        console.log(error);   
      }
    );
  }
}
