import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from '../../../../../../../admin/src/app/services/GLOBAL';

@Component({
  selector: 'app-pedidos-detalles',
  templateUrl: './pedidos-detalles.component.html',
  styleUrls: ['./pedidos-detalles.component.css']
})
export class PedidosDetallesComponent implements OnInit {

  public url: any;
  public igv: any;
  public token: any;
  public orden: any = [];
  public detalles: Array<any> = [];
  public load_data = true;
  public id: any;
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

        this._clienteService.obtener_detalles_ordenes_cliente(this.id, this.token).subscribe(
          response => {
            if(!response.data){
              this.orden = undefined;
            } else {
              this.orden = response.data;
              this.detalles = response.detalles;
              this.load_data = false;
            }
          }
        ); 
      }
    )
  }

  ngOnInit(): void {
    //TODO NO HACE FALTA MÉTODO
  }

}
