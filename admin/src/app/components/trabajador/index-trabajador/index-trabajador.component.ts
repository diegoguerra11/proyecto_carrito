import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { TrabajadorService } from '../../../services/trabajador.service';

@Component({
  selector: 'app-index-trabajador',
  templateUrl: './index-trabajador.component.html',
  styleUrls: ['./index-trabajador.component.css']
})
export class IndexTrabajadorComponent implements OnInit {

  public trabajadores: Array<any> = [];
  public filtro_apellidos = '';
  public filtro_correo = '';

  public page=1;
  public pageSize = 20;
  public token;
  public load_data = true;

  constructor(
    private _adminService : AdminService,
    private _trabajadorService: TrabajadorService
  ) { 
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this.listar_cliente(null,null);
  }

  filtro(tipo) {
    switch(tipo) {
      case 'apellidos':  
        this.load_data=true;
        this.listar_cliente('apellidos', this.filtro_apellidos);
        break;
      case 'correo':  
        this.load_data=true;
        this.listar_cliente('correo', this.filtro_correo);
        break;
      default: this.listar_cliente(null, null);
        break;
    }
  }

  listar_cliente(tipo? , filtro?)
  {
    this._trabajadorService.listar_clientes_filtro_admin(tipo, filtro, this.token).subscribe(
      response => {
        this.trabajadores = response.data;
        this.load_data = false;
      }
    )
  }
}
