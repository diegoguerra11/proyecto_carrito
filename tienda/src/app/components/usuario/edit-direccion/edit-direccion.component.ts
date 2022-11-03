import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GuestService } from 'src/app/services/guest.service';
import { MessageBox } from 'src/app/Utils/MessageBox';
import { ValidationsDireccion } from 'src/app/validations/validationsDireccion';
declare let $:any;
@Component({
  selector: 'app-edit-direccion',
  templateUrl: './edit-direccion.component.html',
  styleUrls: ['./edit-direccion.component.css']
})
export class EditDireccionComponent implements OnInit {

  public token:any;
  public direccion : any = {
    pais: '',
    region: '',
    provincia: '',
    distrito: '',
    principal: false
  };

  public direcciones :Array<any> = [];

  public regiones:Array<any> = [];
  public provincias:Array<any> = [];
  public distritos:Array<any> = [];

  public regiones_arr:Array<any> = [];
  public provincias_arr:Array<any> = [];
  public distritos_arr:Array<any> = [];
  public direccion_principal : any = {};
  public load_data = true;
  public id:any;

  public region:Array<any> = [];
  public provincia:Array<any> = [];
  public distrito:Array<any> = [];
  constructor( 
    private _guestService:GuestService,
    private _clienteService:ClienteService,
    private _router:Router,
    private _activatedRoute: ActivatedRoute) {this.token = localStorage.getItem('token');

    this._guestService.get_Regiones().subscribe(
      response=>{
        this.regiones_arr = response;
      }
    );

    this._guestService.get_Provincias().subscribe(
      response=>{
        this.provincias_arr = response;
      }
    );

    this._guestService.get_Distritos().subscribe(
      response=>{
        this.distritos_arr = response;
      }
    ); }

  ngOnInit(): void {
    this.id = this._activatedRoute.params.subscribe(params => {
      this._clienteService.recibir_direccion_cliente(params["id"],this.token).subscribe(
        response=>{
          if(response.data == undefined){
            this.direccion = undefined;
          }else{
            this.direccion = response.data[0];
            this.direccion.pais = "";
            console.log(this.direccion);
            console.log(this.direccion[0]);
            this.id = params["id"];
            
          }
        }
    );}
    );
  }
  establecer_principal(id:any){
    this._clienteService.cambiar_direccion_principal_cliente(id,localStorage.getItem('_id'),this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('Se actualizó su dirección principal');
      }
    );
  }

  actualizar(actualizarForm:any){
    if (actualizarForm.valid) {
      actualizarForm.form.value["pais"] = "Perú";
      if(!ValidationsDireccion.registrarDireccion(actualizarForm.form.value)){return;}
        console.log(actualizarForm.form.value);
        let data = {
          destinatario: actualizarForm.form.value["destinatario"].trim(),
          numeroDocumento: actualizarForm.form.value["numeroDocumento"].trim(),
          tipoDocumento: actualizarForm.form.value["tipoDocumento"].trim(),
          zip: actualizarForm.form.value["zip"].trim(),
          direccion: actualizarForm.form.value["direccion"].trim(),
          telefono: actualizarForm.form.value["telefono"].trim(),
          pais: actualizarForm.form.value["pais"].trim(),
          region: actualizarForm.form.value["region"].trim(),
          provincia: actualizarForm.form.value["provincia"].trim(),
          distrito: actualizarForm.form.value["distrito"].trim(),
          principal: actualizarForm.form.value["principal"],
          cliente: localStorage.getItem('_id')
        }
        console.log(data);
        this._clienteService.actualizar_direccion_cliente(this.id,data,this.token).subscribe(
          response=>{
            
            MessageBox.messageSuccess("La nueva dirección fue actualizada correctamente");
            this._router.navigate(['/cuenta/direcciones']);
          }
        );
  
    } else {
      MessageBox.messageError("Debe completar todos los campos");
  }
  }

  get_region(){
    this._guestService.get_Regiones().subscribe(
      response=>{
        response.forEach((element:any) => {
          if(element.name == this.direccion.region){
            this.direccion.region = element.name;
          }
        
        });

      }
    );
  }
  get_provincia(){
    this._guestService.get_Provincias().subscribe(
      response=>{
        response.forEach((element:any) => {
            if(element.name == this.direccion.provincia){
            this.direccion.provincia = element.name;
          }
        });
      }
    );
  }

  get_distrito(){
    this._guestService.get_Distritos().subscribe(
      response=>{
        response.forEach((element:any) => {
          
          if(element.name == this.direccion.distrito){
          
            this.direccion.distrito = element.name;
          }
      });
      }
    );
  }

}
