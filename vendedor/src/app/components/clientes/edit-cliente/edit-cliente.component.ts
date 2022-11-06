import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ValidatonsCliente } from 'src/app/validations/validationsCliente';
import { MessageBox } from 'src/app/utils/MessageBox';
import { VendedorService } from 'src/app/services/vendedor.service';

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {

  public cliente : any = {};
  public id:any;
  public token;
  public load_btn = false;
  public load_data = true;

  constructor(
    private _route : ActivatedRoute,
    private _vendedorService: VendedorService,
    private _router: Router
  ) {
    this.token = this._vendedorService.getToken();
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      (params:any) => {
        this.id = params['id'];
        
        this._vendedorService.obtener_cliente_admin(this.id,this.token).subscribe(
          response =>{
            if (response.data == undefined) {
              this.cliente = undefined;
              this.load_data = false;
            }else{
              this.cliente = response.data;
              this.load_data = false;
            }
          },
          error => {
              console.log(error);
          }
        );
      }
    )
  }

  actualizar(updateForm:any){
    if (updateForm.valid) {
      if(!ValidatonsCliente.verificarCliente(updateForm.form.value)){return;}
      this.load_btn = true;
      this._vendedorService.actualizar_cliente_admin(this.id,this.cliente,this.token).subscribe(
        response => {  
          MessageBox.messageSuccess("Cliente Actualizado correctamente");       
    
          this.load_btn = false;

          this._router.navigate(['/panel/clientes']);
        }, error=>{
          console.log(error);
          
        }
      );
    } else {
      MessageBox.messageError("Debe completar todos los campos");  
    }
  }
}
