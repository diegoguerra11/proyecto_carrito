import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { MessageBox } from 'src/app/utils/MessageBox';

declare let $:any;

@Component({
  selector: 'app-show-ventas',
  templateUrl: './show-ventas.component.html',
  styleUrls: ['./show-ventas.component.css']
})
export class ShowVentasComponent implements OnInit {
  public venta : any={};
  public id = '';
  public token = localStorage.getItem('token');
  public load = false;
  public url = GLOBAL.url;
  public detalles : Array<any> = [];
  public load_data = true;
  public totalstar = 5;
  public review : any = {};
  public load_send = false;
  public load_conf_pago = false;
  public load_final= false;
  public load_del= false;
  public tracking = '';
  public pago : any = {};

  constructor(//inyecta los servidores
    private _route:ActivatedRoute,
    private _adminService:AdminService,
    private _router:Router
    ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;

  }


  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this.init_data();
      }
    );
  }
//obtiene detalles de las ordenes de clientes
  init_data(){
    this._adminService.obtener_detalles_ordenes_cliente(this.id,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.venta = response.data;
          if(this.venta.metodo_pago=='Tarjeta de crédito'){
            this._adminService.obtenerPago(this.venta.transaccion).subscribe(
              response=>{
                console.log(response);
                this.pago = response;
              }
            );
          }

          this.detalles = response.detalles;
          this.load_data = false;
        }else{
          this.venta = undefined;
          this.load_data = false;
        }
      }
    );
  }
//marca el cierre de la venta
  finalzar(id:any){
    this.load_final = true;
    this._adminService.marcar_finalizado_orden(id,{data:''},this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('La venta fue cerrada correctamente.');
        $('#openConfVenta').modal('hide');
        $('.modal-backdrop').remove();
        this.load_final = false;
        this.init_data();
      }
    );
  }
//marca la orden como enviada
  enviar(id:any){
    if(this.tracking){
      this.load_send = true;
      this._adminService.marcar_envio_orden(id,{tracking:this.tracking},this.token).subscribe(
        response=>{
         MessageBox.messageSuccess('La orden fue marcada como enviada.');
          $('#openEnviado').modal('hide');
          $('.modal-backdrop').remove();
          this.load_send = false;
          this.init_data();
        }
      );
    }else{
      MessageBox.messageError('Ingrese el numero de seguimiento.');
    }
  }

  cancelar(id:any){
    this.load_del = true;
    this._adminService.cancelar_orden_admin(id,this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('El pedido fue cancelado correctamente.');
        $('#openCancelar').modal('hide');
        $('.modal-backdrop').remove();
        this._router.navigate(['/panel/ventas']);
        this.load_del = false;
      }
    );
  }
//confirma que haya llegado el pago
  confirmar_pago(id:any){
    this.load_conf_pago = true;
    this._adminService.confirmar_pago_orden(id,{data:''},this.token).subscribe(
      response=>{
       MessageBox.messageSuccess('El pago fue confirmado correctamente.');
        $('#openConfirmarPago').modal('hide');
        $('.modal-backdrop').remove();
        this.load_conf_pago = false;
        this.init_data();
      }
    );
  }
}
