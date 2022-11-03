import { Component, OnInit} from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';
import { Router } from '@angular/router';
import { MessageBox } from '../../Utils/MessageBox';

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
  public socket = io('http://localhost:4201');
  public currency = 'PEN';
  public subtotal_const = 0;
  public carrito_load = true;
  public direccion_principal : any = {};
  public envios : Array<any>=[];
  public venta : any = {};
  public dventa : Array<any> = [];
  public card_data : any = {};
  public envio_titulo:any = 'Recojo en Tienda';
  public descuento_activo : any = undefined;
  public tipo_descuento = undefined;
  public valor_descuento = 0;
  public btn_load = false;
  public metodo_pago = 'pasarela_pago';
  public envio_gratis= false;
  public descuento = 0;
  public envio = 0;
  public nota = '';
  public cuponTemporal = "";
  public totalAPagarEstatico = 0;
  public totalAPagarMovible = 0;
  public cuponAgregado = false;

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
      response => {this.envios = response;}
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
    this.get_direccion_principal(); 
    this.init_Data();
    
    
  }

  init_Data(){
    this.carrito_load = false;
    this.calcular_total();
  }

  // obtiene los productos que el cliente ha agregado al carrito y calcula los precios
  async obtener_carrito(){
    this._clienteService.obtener_carrito_cliente(this.user_lc._id,this.token).subscribe(
      response=>{
        this.carrito_arr = response.data;
        this.carrito_arr.forEach(element => {
          if(this.currency == 'PEN'){
            this.dventa.push({
              producto: element.producto._id,
              subtotal: element.producto.precio * element.cantidad,
              variedad: element.variedad._id,
              cantidad: element.cantidad,
              cliente: localStorage.getItem('_id')
            });
          }  
          this.calcular_carrito();
          this.calcular_total();
        });
      }
    );
  }

  // pasa los datos del carrito a un pedido y lo registra
  generar_pedido(){

    if (!this.direccion_principal){
      this._router.navigate(['/cuenta/direcciones/']);
      return MessageBox.messageError("Debe tener una dirección de envio registrada");
    }                                                                         
    this.venta.transaccion = 'Venta pedido';
    if(this.currency != 'PEN'){
      this.venta.currency = 'USD';
    }else{
      this.venta.currency = 'PEN';
    }
    this.venta.subtotal = this.subtotal;
    this.venta.total_pagar = this.totalAPagarEstatico;
    this.venta.envio_precio = this.envio;
    this.venta.detalles = this.dventa;
    this.venta.metodo_pago = this.metodo_pago;
    this.venta.nota = this.nota;
    this.venta.direccion = this.direccion_principal._id;
    this.venta.tipo_descuento = this.tipo_descuento;
    this.venta.valor_descuento = this.valor_descuento;
    let idcliente = localStorage.getItem('_id');
    this.venta.cliente = idcliente;
    this.btn_load = true;
    if(!this.cuponAgregado){
      this.venta.tipo_descuento = undefined;
      this.venta.valor_descuento = undefined;
      this.venta.cupon = undefined;
    }
    
    console.log(this.venta);
    this._guestService.registro_pedido_compra_cliente(this.venta,this.token).subscribe(
      response=>{
        this.btn_load = false;
        console.log();
        this._clienteService.disminuir_cupon(response.data["cupon"], this.token).subscribe(
          response=>{
            console.log("miau");
            console.log(response);
          }
        );
        if(!response.data){return MessageBox.messageError(response.data.message);}
        
        this._router.navigate(['/cuenta/pedidos/',response.data._id]);
      }
    );
  }

  // cuando se presiona el boton, ejecuta los metodos get_token_mercado_pago, generar_pedido y generar_pedido
  pagar() {
    if(this.envio_titulo != "Delivery") {return MessageBox.messageError("Debe seleccionar un método de envío");}
    switch(this.metodo_pago){
      case 'pasarela_pago':
        this.get_token_mercado_pago();
        break;
      case 'yape_plin':
        this.generar_pedido();
        break;
      case 'transferencia':
        this.generar_pedido();
        break;
    }
  }

  get_token_mercado_pago(){
    if(!this.direccion_principal){
      this._router.navigate(['/cuenta/direcciones/']);
      return MessageBox.messageError("Debe registrar una dirección de envío");
    }
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
          unit_price:  this.envio
        });

        if(this.cuponTemporal != ""){
          items.push({
            title: 'Descuento',
              description: 'Cupón aplicado ' + this.cuponTemporal,
              quantity: 1,
              currency_id: 'PEN',
              unit_price: -this.descuento
          });
        }
        if(!this.cuponAgregado){
          this.tipo_descuento = undefined;
          this.valor_descuento = 0;
          this.cuponTemporal = "undefined";
        }
        
        let data = {
          notification_url: 'https://hookb.in/6JlGBe8MYbsoRnwwRd1Z',
          items: items,
          back_urls: {
            failure: "http://localhost:4200/verificar-pago/failure/"+this.direccion_principal._id+'/'+this.cuponTemporal+'/'+this.envio+'/'+this.tipo_descuento+'/'+this.valor_descuento+'/'+this.totalAPagarMovible+'/'+this.subtotal,
            pending: "http://localhost:4200/verificar-pago/pending/"+this.direccion_principal._id+'/'+this.cuponTemporal+'/'+this.envio+'/'+this.tipo_descuento+'/'+this.valor_descuento+'/'+this.totalAPagarMovible+'/'+this.subtotal,
            success: "http://localhost:4200/verificar-pago/success/"+this.direccion_principal._id+'/'+this.cuponTemporal+'/'+this.envio+'/'+this.tipo_descuento+'/'+this.valor_descuento+'/'+this.totalAPagarMovible+'/'+this.subtotal,
          },
          auto_return: "approved",
          payment_methods: {
            excluded_payment_types: [
                {
                  id: "ticket"
                },
                {
                  id: "atm"
                }
            ],
          },
        }
        this._guestService.createToken(data).subscribe(
          response=>{
            window.location.href = response.sandbox_init_point;
          }
        );
      }
    );
  }

  // obtiene la direccion que el cliente haya guardado previamente
  get_direccion_principal(){
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'),this.token).subscribe(
      response=>{
        
          if(response.data == undefined){
          this.direccion_principal = undefined;
        }else{
          this.direccion_principal = response.data;
          
          this.venta.direccion = this.direccion_principal._id;
        }
      }
    );
  }

  // calcula el precio del carrito sin descuento dependiendo si es en soles o dolares
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
    this.totalAPagarMovible = this.subtotal_const;
  }

  // calcula el precio del carrito con el descuento y el envio
  calcular_total(){
    let descuentoActual = 0;
    if(this.valor_descuento != 0){
      this.descuento = this.valor_descuento;
      descuentoActual = this.valor_descuento;
    }

    this.select_direccion_envio(this.direccion_principal);

    this.totalAPagarMovible = this.subtotal + this.envio - descuentoActual; 
    this.venta.subtotal = this.totalAPagarMovible;
    this.venta.envio_precio = this.envio;
    this.venta.envio_titulo = this.envio_titulo;
    
    this.totalAPagarEstatico = this.totalAPagarMovible;
  }

  // elimina un producto del carrito y actualiza el total del carrito
  eliminar_item_guest(item:any){
    this.totalAPagarMovible  = 0;
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
    this.totalAPagarMovible = this.subtotal_const;
    this.totalAPagarEstatico = this.totalAPagarMovible;
  }

  // elimina un producto del carrito y actualiza el total del carrito
  eliminar_item(id:any){
    this._clienteService.eliminar_carrito_cliente(id,this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('Se eliminó el producto correctamente.');
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

  // si la region es de lima el envio cuesta 10 soles, caso contrario cuesta 15
  select_direccion_envio(item:any){
    
    this.envio_gratis = false;
    let direccion = item;
    if(!direccion){return;}
    if(direccion.pais == 'Perú'){
      if(direccion.region == 'Lima'){
        this.envio = 10;
      }else if(direccion.region != 'Lima'){
        this.envio = 15;
      }
    }
  }

  // valida el cupon como ser menor a 25 caracteres, y luego llama al metodo calcular_total para el precio del carrito
  validar_cupon(){
    if(this.cuponTemporal != "") {return MessageBox.messageError("Solo se puede canjear un cupón por compra");}
    if(!this.venta.cupon) {return MessageBox.messageError('El cupon no es valido.');}
    if(this.venta.cupon.toString().length > 25) {return MessageBox.messageError('El cupon debe ser menos de 25 caracteres.');}
    this._clienteService.validar_cupon_admin(this.venta.cupon,this.token).subscribe(
      response=>{
        if(!response.data){return MessageBox.messageError(response.message);}
        this.cuponAgregado = true;
        this.totalAPagarEstatico = this.totalAPagarMovible;
        this.tipo_descuento =  response.data.tipo;
        if(response.data.tipo == 'Valor Fijo'){
          this.descuento = response.data.valor;
          let descuentoLocal = 0;
          this.valor_descuento = this.descuento;
          this.totalAPagarMovible = (this.totalAPagarEstatico - descuentoLocal);

        }
        if(response.data.tipo == 'Porcentaje'){
          this.descuento =Math.round((this.totalAPagarEstatico * response.data.valor)/100);
          let descuentoLocal = 0;
          this.valor_descuento = this.descuento;
          this.totalAPagarMovible = (this.totalAPagarEstatico - descuentoLocal);
        }
        this.cuponTemporal = this.venta.cupon;
        this.calcular_total();
      }
    );
  }

}
