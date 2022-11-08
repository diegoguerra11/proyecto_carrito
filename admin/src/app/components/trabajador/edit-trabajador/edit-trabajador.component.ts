import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { TrabajadorService } from 'src/app/services/trabajador.service';
import { ValidatonsTrabajador } from 'src/app/validations/validationsTrabajador';
import { MessageBox } from '../../../../../../tienda/src/app/Utils/MessageBox';

@Component({
  selector: 'app-edit-trabajador',
  templateUrl: './edit-trabajador.component.html',
  styleUrls: ['./edit-trabajador.component.css']
})
export class EditTrabajadorComponent implements OnInit {

  public trabajador: any = {};
  public id;
  public token;
  public load_btn = false;
  public load_data = true;

  constructor(
    private _route : ActivatedRoute,
    private _adminService : AdminService,
    private _trabajadorService: TrabajadorService,
    private _router: Router
  ) { 
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this.obtener_trabajador();
  }

  obtener_trabajador () {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this._trabajadorService.obtener_trabajador_admin(this.id, this.token).subscribe(
          response => {
            if(!response.data){MessageBox.messageError(response.message);}
            this.trabajador = response.data ? response.data : undefined;
            this.load_data = false;
          }
        )
      }
    )
  }

  actualizar(updateForm) {
    if(!ValidatonsTrabajador.verificarTrabajador(updateForm.form.value)){return;}
    this.load_btn = true;

    this._trabajadorService.actualizar_trabajador_admin(this.id, this.trabajador, this.token).subscribe(
      response => {
        MessageBox.messageSuccess('Trabajdor actualizado correctamente');
        this.load_btn = false;
        this._router.navigate(['/panel/trabajadores']);
      },
      error => {
        console.log(error);
      }
    )
  
  }

}
