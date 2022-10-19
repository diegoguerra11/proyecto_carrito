import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { io } from "socket.io-client";

declare var iziToast:any;

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

  constructor(
    private _clienteService: ClienteService,
  ) { 

    this.idcliente = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');
    this.url =GLOBAL.url;

    if(this.token){
      let obj_lc :any= localStorage.getItem('user_data');
      this.user_lc = JSON.parse(obj_lc);
      this.obtener_carrito();
    }

    if(this.user_lc == undefined){
      let ls_cart = localStorage.getItem('cart');
      console.log(ls_cart);
      if(ls_cart != null){
        this.carrito_logout = JSON.parse(ls_cart);
        this.calcular_carrito();
      }else{
        this.carrito_logout = [];
      }
      
    }
    
  }

  ngOnInit(): void {
   
  }

  obtener_carrito(){
    this._clienteService.obtener_carrito_cliente(this.user_lc._id,this.token).subscribe(
      response=>{
        this.carrito_arr = response.data;
        this.calcular_carrito();
        
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

  eliminar_item_guest(item:any){
    this.total_pagar  = 0;
    this.carrito_logout.splice(item._id,1);
    localStorage.removeItem('cart');
    iziToast.show({
      title: 'SUCCESS',
      titleColor: '#1DC74C',
      color: '#FFF',
      class: 'text-success',
      position: 'topRight',
      message: 'Se eliminó el producto correctamente.'
  });
  
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
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó el producto correctamente.'
        });
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
