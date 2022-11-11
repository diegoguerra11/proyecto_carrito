import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from '../../../../../../../admin/src/app/services/GLOBAL';

@Component({
  selector: 'app-ver-boleta',
  templateUrl: './ver-boleta.component.html',
  styleUrls: ['./ver-boleta.component.css']
})
export class VerBoletaComponent implements OnInit {

  public url: any;
  public igv: any;
  public token: any;
  public orden: any = [];
  public detalles: Array<any> = [];
  public load_data = true;
  public id: any;
  public cliente:any = {};
  public direccion:any = {};
  public totalstar=5;
  public review : any={};

  constructor(
    private _clienteService: ClienteService,
    private _route: ActivatedRoute
  ) {

    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this._clienteService.verBoleta(this.id, this.token).subscribe(
          response => {
            this.orden = response.data;
            if(response.data){
              this.detalles = response.detalles;
              this.cliente = response.data.cliente;
              this.direccion = response.data.direccion;
            }
            this.load_data = false;
          }
        );
      }
    )
  }

  ngOnInit(): void {
  }

}
