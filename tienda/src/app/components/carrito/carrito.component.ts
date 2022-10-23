import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';
import { Router } from '@angular/router';
import { MessageBox } from '../../../../../admin/src/app/utils/MessageBox';

declare var iziToast:any;
// declare var Cleave:any;
declare var StickySidebar:any;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  
  public idcliente;
  public token;
  public user : any = undefined;
  public user_lc : any = undefined;  

  public carrito_arr : Array<any> = [];
  public carrito_logout :Array<any> = [];
  public url;
  public subtotal = 0;
  public total_pagar = 0;
  public socket = io('http://localhost:4201');
  public currency = 'PEN';
  public subtotal_const = 0;
  public carrito_load = true;

  public precio_envio = "0";
  public direccion_principal : any = {};
  public envios : Array<any>=[];
  public venta : any = {};
  public dventa : Array<any> = [];
  public card_data : any = {};
  public descuento_activo : any = undefined;
  public tipo_descuento = undefined;
  public valor_descuento = 0;
  public btn_load = false;
  public metodo_pago = 'pasarela_pago';
  public envio_gratis= false;
  public descuento = 0;
  public envio = 0;
  public nota = '';

  constructor(
    private _clienteService: ClienteService,
    private _guestService:GuestService,
    private _router:Router
  ) { 
    this.token = localStorage.getItem('token');
    
    if(!this.token){_router.navigate(['/login']);}

    this.idcliente = localStorage.getItem('_id');

    this.venta.cliente = this.idcliente;
    this.url =GLOBAL.url;
    this._guestService.get_Envios().subscribe(
      response=>{
        this.envios = response;
      }
    );

    if(this.token){
      let obj_lc :any = localStorage.getItem('user_data');
      this.user_lc = JSON.parse(obj_lc);
      this.obtener_carrito();
    }

    if(this.user_lc == undefined){
      let ls_cart = localStorage.getItem('cart');

      if(ls_cart != null){
        this.carrito_logout = JSON.parse(ls_cart);
        this.calcular_carrito();
      }else{
        this.carrito_logout = [];
      }
    } 
  }

  ngOnInit(): void {

    this._guestService.obtener_descuento_activo().subscribe(
      response=>{
        this.descuento_activo = response.data != undefined ? response.data[0] : undefined;
      }
    );

    setTimeout(()=>{
      new StickySidebar('.sidebar-sticky', {topSpacing: 20});
    });

    this.init_Data();
    
    this.get_direccion_principal();   
  }

  init_Data(){
    this._clienteService.obtener_carrito_cliente(this.idcliente,this.token).subscribe(
      response=>{
        this.carrito_arr = response.data;

        this.carrito_arr.forEach(element => {
            this.dventa.push({
              producto: element.producto._id,
              subtotal: element.producto.precio,
              variedad: element.variedad,
              cantidad: element.cantidad,
              cliente: localStorage.getItem('_id')
            });
        });
        this.carrito_load = false;

        this.calcular_carrito();
        this.cacular_total('Envio Gratis');
      }
    );
  }

  obtener_carrito(){
    this._clienteService.obtener_carrito_cliente(this.user_lc._id,this.token).subscribe(
      response=>{
        this.carrito_arr = response.data;
        this.carrito_arr.forEach(element => { 
          if(this.currency == 'PEN'){
            this.dventa.push({
              producto: element.producto._id,
              subtotal: element.producto.precio,
              variedad: element.variedad._id,
              cantidad: element.cantidad,
              cliente: localStorage.getItem('_id')
            });
          }  
      });
        this.calcular_carrito();
        
      }
    );
  }

  generar_pedido(){
    this.venta.transaccion = 'Venta pedido';
    if(this.currency != 'PEN'){
      this.venta.currency = 'USD';
    }else{
      this.venta.currency = 'PEN';
    }
    this.venta.subtotal = this.subtotal;
    this.venta.total_pagar = this.total_pagar;
    this.venta.envio_precio = this.envio;
    this.venta.detalles = this.dventa;
    this.venta.metodo_pago = this.metodo_pago;
    this.venta.nota = this.nota;
    this.venta.direccion = this.direccion_principal._id;
    this.venta.tipo_descuento = this.tipo_descuento;
    this.venta.valor_descuento = this.valor_descuento;
    let idcliente = localStorage.getItem('_id');
    this.venta.cliente = idcliente;
    console.log(this.venta);
    
    this.btn_load = true;
    this._guestService.pedido_compra_cliente(this.venta,this.token).subscribe(
      response=>{
        console.log(response);
        
        if(response.venta == undefined){          
          MessageBox.messageError(response.message);
          this.btn_load = false;
          return;
        }

        this.btn_load = false;
        this._router.navigate(['/cuenta/pedidos',response.venta._id]);
      }
    );
  }

  pagar() {
    switch(this.metodo_pago){
      case 'pasarela_pago':
        this.get_token_mercado_pago();
        break;
      case 'yape_plin':
        this.generar_pedido();
        break;
      case 'transferencia':
        console.log('trasnferencia');
        break;
    }
  }

  get_token_mercado_pago(){
    this._guestService.comprobar_carrito_cliente({detalles:this.dventa},this.token).subscribe(
      (response: any)=>{
        if(!response.venta){
          this.btn_load = false;
          return MessageBox.messageError(response.message);
        }

        let items = [];
          
        this.carrito_arr.forEach(element => {
          items.push({
            title: element.producto.titulo,
            description: element.producto.descripcion,
            quantity: element.cantidad,
            currency_id: 'PEN',
            unit_price: element.producto.precio
          });
        });

        items.push({
          title: 'Envio',
          description: 'Concepto de transporte y logistica',
          quantity: 1,
          currency_id: 'PEN',
          unit_price:  parseInt(this.precio_envio)
        });

        if(this.venta.cupon){
          items.push({
            title: 'Descuento',
              description: 'Cupón aplicado ' + this.venta.cupon,
              quantity: 1,
              currency_id: 'PEN',
              unit_price: 0//-(this.descuento)
          });
        }

        let data = {
          notification_url: 'https://hookb.in/6JlGBe8MYbsoRnwwRd1Z',
          items: items,
          back_urls: {
            failure: "http://localhost:4200/carrito/",
            //pending: response.sandbox_init_point,
            success: "http://localhost:4200/inicio/"+this.direccion_principal._id+'/'+this.venta.cupon+'/'+this.envio+'/'+this.tipo_descuento+'/'+this.valor_descuento+'/'+this.total_pagar+'/'+this.subtotal,
          },
          //auto_return: "approved"
        }

        this._guestService.createToken(data).subscribe(
          response=>{
            console.log(response);
            window.open(response.sandbox_init_point, '_blank');
          }
        );
      }
    );
  }

  get_direccion_principal(){
   
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'),this.token).subscribe(
      
      response=>{
        if(response.data == undefined){
          console.log(response.data);
          this.direccion_principal = undefined; 
        }else{
          console.log(response.data);
          this.direccion_principal = response.data;
          this.venta.direccion = this.direccion_principal._id;
        }  
      }
    );
  }

  calcular_carrito(){
    this.subtotal = 0;
    if(this.user_lc != undefined){
      if(this.currency == 'PEN'){
        this.carrito_arr.forEach(element => {
            let sub_precio = parseInt(element.producto.precio) * element.cantidad;
            this.subtotal = this.subtotal + sub_precio;
        });
      }else{
        this.carrito_arr.forEach(element => {
          let sub_precio = parseInt(element.producto.precio_dolar) * element.cantidad;
          this.subtotal = this.subtotal + sub_precio;
      });
      }
    }else if(this.user_lc == undefined){
      if(this.currency == 'PEN'){
        this.carrito_logout.forEach(element => {
          let sub_precio = parseInt(element.producto.precio) * element.cantidad;
            this.subtotal = this.subtotal + sub_precio;
        });
      }else{
        this.carrito_logout.forEach(element => {
          let sub_precio = parseInt(element.producto.precio_dolar) * element.cantidad;
            this.subtotal = this.subtotal + sub_precio;
        });
      }
    }
    this.subtotal_const = this.subtotal;
    this.total_pagar = this.subtotal_const;
  }

  cacular_total(envio_titulo:any){
    this.total_pagar = parseInt(this.subtotal.toString()) + parseInt(this.precio_envio);
    this.venta.subtotal = this.total_pagar;
    this.venta.envio_precio = parseInt(this.precio_envio);
    this.venta.envio_titulo = envio_titulo;

    console.log(this.venta);
    
  }

  eliminar_item_guest(item:any){
    this.total_pagar  = 0;
    this.carrito_logout.splice(item._id,1);
    localStorage.removeItem('cart');

    MessageBox.messageSuccess('Se eliminó el producto correctamente.');
  
    if(this.carrito_logout.length >= 1){
      localStorage.setItem('cart',JSON.stringify(this.carrito_logout));
    }
    if(this.currency == 'PEN'){
      let monto = item.producto.precio*item.cantidad;
      this.subtotal = this.subtotal -monto;
   
    } else if(this.currency != 'PEN'){
      let monto = item.producto.precio_dolar*item.cantidad;
      this.subtotal = this.subtotal -monto;
    }
    this.subtotal_const = this.subtotal;
    this.total_pagar = this.subtotal_const;
  }

  eliminar_item(id:any){
    console.log(id);
    this._clienteService.eliminar_carrito_cliente(id,this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('Se eliminó el producto correctamente.');
      
        console.log(response.data + "eliminaritem");
        this.socket.emit('delete-carrito',{data:response.data});
        this._clienteService.obtener_carrito_cliente(this.idcliente,this.token).subscribe(
          response=>{
            this.carrito_arr = response.data;
            this.calcular_carrito();
            
          }
        );
        
      }
    );
  }
  
}
