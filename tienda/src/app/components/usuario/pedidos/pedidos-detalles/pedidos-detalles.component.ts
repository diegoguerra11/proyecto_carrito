import { Component, OnInit, ɵNG_ELEMENT_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StarRatingComponent } from 'ng-starrating';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from '../../../../../../../admin/src/app/services/GLOBAL';
declare var iziToast:any;
declare var $:any;

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

  public totalstars=5;
  public totalstar=5;
  public review : any={};
  
  public hayCupon = false;
  public valorCupon = 0;

  constructor(
    private _clienteService: ClienteService,
    private _route: ActivatedRoute
  ) { 
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        
         this.init_data();
      }
    )
  }

  init_data(){
    this._clienteService.obtener_detalles_ordenes_cliente(this.id, this.token).subscribe(
      response => {
        this.orden = response.data;
        response.detalles.forEach((element:any) =>{
          this._clienteService.obtener_review_producto_cliente(element.producto._id).subscribe(
            response=>{
              let emitido = false;
              response.data.forEach((element_:any) =>{
                if(element_.cliente ==localStorage.getItem('_id')){
                  emitido = true;
                }
              });
              element.estado = emitido;
            }
          );
        });
        this.detalles = response.detalles;
        this.load_data = false;
        if(!response.data){
          this.orden = undefined;
        } else {
          this._clienteService.obtener_cupon_cliente(this.orden["cupon"],this.token).subscribe(
            response=>{
              //console.log(response.data);
              if (response.data == undefined) {
                this.hayCupon = false;
              }else{
                this.hayCupon = true;
                this.valorCupon = this.getValorCupon(response.data["tipo"], response.data["valor"], this.orden.subtotal);
              }
            }
          );
        }
      }
    );
  }

  getValorCupon(cupon:any, valorCupon:any, subtotal:any){
    let descuento = 0;
    if(cupon == 'Valor Fijo'){
      descuento =valorCupon;
    }
    if (cupon == 'Porcentaje'){
      descuento =Math.round((subtotal *valorCupon)/100);
    }
    return descuento;
  }
  ngOnInit(): void {
    //TODO NO HACE FALTA MÉTODO
  }

  openModal(item:any){
    this.review = {}; // formatea el objeto review para vaciarlo por si se ha llenado antes
    this.review.producto = item.producto._id; // llena el review
    this.review.cliente = item.cliente;
    this.review.venta = this.id;
  }

  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}){
    this.totalstar = $event.newValue;
  }

  emitir(id:any){
    if(this.review.review){
      // validacion del numero de estrellas
      if (this.totalstar && this.totalstar>=0){
        this.review.estrellas = this.totalstar; // coloca el valor al objeto review
        // envio de la data al backend para que la reseña sea registrada
        this._clienteService.emitir_review_producto_cliente(this.review, this.token).subscribe(
          response=>{
            iziToast.show({
              title:'SUCCESS',
              titleColor:'#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se emitió correctamente la reseña'
            });
            $('#review-'+id).modal('hide');
            $('.modal-backdrop').removeClass('show');
            this.init_data(); // al cerrarse el modal lo llama para que actualice algunas cosas
          }
        );
      } 
      // si es falso entonces enviara una notificacion
      else {
        iziToast.show({
          title:'ERROR',
          titleColor:'#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Seleccione el número de estrellas'
        });
      }
    } else {
      iziToast.show({
        title:'ERROR',
        titleColor:'#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingrese el mensaje de la reseña'
      });
    }
  }
}
