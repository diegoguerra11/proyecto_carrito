import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { GLOBAL } from '../../../../../admin/src/app/services/GLOBAL';
import { io } from "socket.io-client";
declare var iziToast:any;

declare var $:any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public currency = 'PEN';
  public token;
  public id;
  public user : any = undefined;
  public user_lc : any = undefined;
  public config_global : any = {};
  public op_cart = false;
  public carrito_logout :Array<any> = [];
  public carrito_arr : Array<any> = [];
  public url;
  public subtotal = 0;
  public socket = io('http://localhost:4201');

  constructor(
    private _clienteService: ClienteService,
    private _router: Router,
  ) { 
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this.url = GLOBAL.url;

   
      this._clienteService.obtener_config_publico().subscribe(
        response=>{
          this.config_global = response.data;
          
        }
      )
      if(this.user_lc == undefined){
        let ls_cart = localStorage.getItem('cart');
        
        if(ls_cart != null){
          this.carrito_logout = JSON.parse(ls_cart);
          
          this.calcular_carrito();
        }else{
          this.carrito_logout = [];
        }
      } 
      console.log(this.carrito_logout);

   if (this.token) {
    this._clienteService.obtener_cliente_guest(this.id,this.token).subscribe(
      response=>{
        this.user = response.data;
        localStorage.setItem('user_data',JSON.stringify(this.user));
        if(localStorage.getItem('user_data')){
          this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

          this.obtener_carrito();         
        }else{
          this.user_lc = undefined;
        }
      },
      error=>{
        this.user = undefined;
      }
    );
   } 
  }
  
  obtener_carrito(){
    this._clienteService.obtener_carrito_cliente(this.user_lc._id,this.token).subscribe(
      response=>{
        this.carrito_arr = response.data;
        this.calcular_carrito();
      }
    );
  }

  ngOnInit(): void {
    if(this.token == null){
      this.socket.on('new-carrito-add',(data)=>{
        if(this.user_lc == undefined){
          let ls_cart = localStorage.getItem('cart');
          if(ls_cart != null){
            this.carrito_logout = JSON.parse(ls_cart);
            this.calcular_carrito();
          }else{
            this.carrito_logout = [];
          }
          
        }else{
          this.obtener_carrito();
        }
        
      });
    }
    else{this.socket.on('new-carrito', this.obtener_carrito.bind(this));

    this.socket.on('new-carrito-add', this.obtener_carrito.bind(this));}

   
  }
  openMenu(){
    var clase = $('#modalMenu').attr('class');
    console.log(clase);
    if(clase == 'ps-panel--sidebar'){
      $('#modalMenu').addClass('active');
    }else if(clase == 'ps-panel--sidebar active'){
      $('#modalMenu').removeClass('active');
    }
  }
  openCart(){
    var clase = $('#modalCarrito').attr('class');
    console.log(clase);
    if(clase == 'ps-panel--sidebar'){
      $('#modalCarrito').addClass('active');
    }else if(clase == 'ps-panel--sidebar active'){
      $('#modalCarrito').removeClass('active');
    }
  }
  logout(){
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);
  }

  op_modalcart(){
    if(!this.op_cart){
      this.op_cart = true;
      $('#cart').addClass('show');
    }else{
      this.op_cart = false;
      $('#cart').removeClass('show');
    }
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
  }

  eliminar_item(id:any){
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
        this.socket.emit('delete-carrito',{data:response.data});
        console.log(response);
        
      }
    );
  }
  eliminar_item_guest(item:any){
    this.carrito_logout.splice(item._id,1);
    console.log("miau");
    localStorage.removeItem('cart');
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
  }

}
