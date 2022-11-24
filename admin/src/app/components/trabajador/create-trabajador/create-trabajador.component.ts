import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { TrabajadorService } from '../../../services/trabajador.service';
import { MessageBox } from '../../../utils/MessageBox';
import { Router } from '@angular/router';
import { ValidatonsTrabajador } from '../../../validations/validationsTrabajador';

@Component({
  selector: 'app-create-trabajador',
  templateUrl: './create-trabajador.component.html',
  styleUrls: ['./create-trabajador.component.css']
})
export class CreateTrabajadorComponent implements OnInit {

  public trabajador: any = {};
  public token;
  public roles: any = [];
  public userRol:any;
  public load_btn = false;

  constructor(
    private _router: Router,
    private _adminService: AdminService,
    private _trabajadorService: TrabajadorService
  ) {  
    this.token = this._adminService.getToken();
    this.userRol = localStorage.getItem('rol');
  }

  ngOnInit(): void {
    this.obtener_roles();
  }

  registro(registroForm) {
    if(!ValidatonsTrabajador.verificarTrabajador(registroForm.form.value, null)){return;}

    this._trabajadorService.registrar_trabajador_admin(this.trabajador, this.token).subscribe(
      response => {
        this.load_btn = false;
        if(!response.data){
          return MessageBox.messageError(response.message);
        }
        this.trabajador = {
          nombres: '',
          apellidos: '',
          telefono: '',
          numeroDocumento: '',
          dni: '',
          password: '',
          email: ''
        }

        MessageBox.messageSuccess('Se registró correctamente al trabajador');
      
        this._router.navigate(['panel/trabajadores']);
      },
      error => {
        console.log(error);
      }
    );
  }

  obtener_roles() {
    this._trabajadorService.get_Roles().subscribe(
      response => {
        this.roles = response;
      }
    )
  }

}
