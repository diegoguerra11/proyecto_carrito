import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GuestService } from '../../../services/guest.service';
import { ClienteService } from '../../../services/cliente.service';
import { io } from "socket.io-client";
import { MessageBox } from 'src/app/Utils/MessageBox';

declare var tns:any;
declare var lightGallery:any;

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {
  
  public numerico = /^[0-9]+$/;
  public token:any;
  public slug:any;
  public producto:any = {};
  public url:string;
  public productos_rec : Array<any> = [];

  public user_lc : any = undefined;

  public carrito_data : any = {
    variedad: '',
    cantidad: 1,
  };

  public btn_cart = false;
  public socket = io('http://localhost:4201');
  public stock = 0;

  public variedades :Array<any> = [];
  public select_variedad_lbl = '';
  public obj_variedad_select : any= {
    id: '',
    stock: 0,
    variedad: ''
  }
  constructor(

    private _route : ActivatedRoute,
    private _guestService: GuestService,
    private _clienteService: ClienteService

  ) {  
    
    let obj_lc :any= localStorage.getItem('user_data');
    this.user_lc = JSON.parse(obj_lc);

    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params=>{
        this.slug = params['slug'];
        
        this._guestService.obtener_productos_slug_publico(this.slug).subscribe(
          response=>{
            this.producto = response.data;

            this._guestService.listar_productos_recomendados_publico(this.producto.categoria).subscribe(
              response=>{
                this.productos_rec = response.data;
              }
            );
            
          }
        );
        
      }
    );

  }

  ngOnInit(): void {

    setTimeout(()=>{
      tns({
        container: '.cs-carousel-inner',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        navContainer: "#cs-thumbnails",
        navAsThumbnails: true,
        gutter: 15,
      });

      var e = document.querySelectorAll(".cs-gallery");
      if (e.length){
        for (var t = 0; t < e.length; t++){
          lightGallery(e[t], { 
            selector: ".cs-gallery-item", 
            download: !1, 
            videojs: !0, 
            youtubePlayerParams: { 
              modestbranding: 1, 
              showinfo: 0, 
              rel: 0 
            }, 
            vimeoPlayerParams: { 
              byline: 0, 
              portrait: 0 
            }
          });
        }
      }

      
    },500); 

  }

  init_variedades(){
    this._guestService.obtener_variedades_productos_cliente(this.producto._id).subscribe(
      response=>{
        this.variedades = response.data;
      }
    );
  }

  select_variedad(){
    console.log(this.select_variedad_lbl);
    let arr_variedad = this.select_variedad_lbl.split('_');
    this.obj_variedad_select.id = arr_variedad[0];
    this.obj_variedad_select.variedad = arr_variedad[0];
    this.obj_variedad_select.stock =this.producto.stock;

    console.log(this.obj_variedad_select);
  }

  SumCant(){
    this.carrito_data.cantidad = this.carrito_data.cantidad + 1;
  }

  RestCant(){
    if(this.carrito_data.cantidad >= 1){
      this.carrito_data.cantidad = this.carrito_data.cantidad - 1;
    }
  }


  agregar_producto(){
    if(!this.obj_variedad_select.variedad){return MessageBox.messageError('Seleccione una talla de producto');}

    if(!this.carrito_data.cantidad.toString().match(this.numerico)){return MessageBox.messageError('El campo Cantidad debe ser numérico positivo');}
   
    if(this.carrito_data.cantidad < 1){return MessageBox.messageError('Ingrese una cantidad válida');}

    if(this.carrito_data.cantidad >= this.obj_variedad_select.stock){return MessageBox.messageError('La cantidad máxima del producto es ' + this.obj_variedad_select.stock);}

    let data = {
      producto: this.producto._id,
      cliente: localStorage.getItem('_id'),
      cantidad: this.carrito_data.cantidad,
      variedad: this.obj_variedad_select.id,
    }
    this.btn_cart =true;
    
    this._guestService.agregar_carrito_cliente(data,this.token).subscribe(response=>{
        if(response.data == undefined){
          this.btn_cart =false;
          MessageBox.messageError('Producto Agregado Anteriormente');
          return;
        }

        MessageBox.messageSuccess('Se agregó el producto al carrito.');

        this.socket.emit('add-carrito-add',{data:true});
        this.btn_cart =false;
      }
    );
  }

  agregar_producto_guest(){
    if(!this.obj_variedad_select.variedad){return MessageBox.messageError('Seleccione una talla de producto.');}
    if(!this.carrito_data.cantidad.toString().match(this.numerico)) {return MessageBox.messageError('El campo Cantidad debe ser numérico positivo');}
    if(this.carrito_data.cantidad < 1) {return MessageBox.messageError('Ingrese una cantidad valida.');}
    if(!(this.carrito_data.cantidad <= this.obj_variedad_select.stock)) {return MessageBox.messageError('La cantidad máxima del producto es.' + this.obj_variedad_select.stock);}

    let data = {
      producto: this.producto,
      variedad: this.obj_variedad_select,
      cantidad: this.carrito_data.cantidad,
    }
    let ls_carrito_guest = localStorage.getItem('cart');
    
    if(ls_carrito_guest == null){
      let arr_carrito = [];
      arr_carrito.push(data);
      localStorage.setItem('cart',JSON.stringify(arr_carrito));

      MessageBox.messageSuccess('Se agregó el producto a tu carrito.');

      this.obj_variedad_select = {
        id: '',
        stock: 0,
        variedad: ''
      }

      this.carrito_data.cantidad = 0;
      this.select_variedad_lbl = '';
      this.socket.emit('add-carrito-add',{data:true});

    }else{
      let productoEnCarrito = false;
      let arrayTemporalCarrito = JSON.parse(ls_carrito_guest);
      for (let index = 0; index < arrayTemporalCarrito.length; index++) {
        const element = arrayTemporalCarrito[index];
        productoEnCarrito = data.producto["_id"] == element.producto["_id"];
      }

      if(productoEnCarrito) {MessageBox.messageError('Producto Ingresado previamente en el carrito'); return;}

      let arr_carrito = JSON.parse(ls_carrito_guest);
      localStorage.removeItem('cart');
      arr_carrito.push(data);
      console.log(arr_carrito[0].producto["_id"]);
      localStorage.setItem('cart',JSON.stringify(arr_carrito));
      console.log("else");
      console.log(arr_carrito);

      MessageBox.messageSuccess('Se agregó el producto a tu carrito.');

      this.obj_variedad_select= {
        id: '',
        stock: 0,
        variedad: ''
      }

      this.carrito_data.cantidad = 0;
      this.select_variedad_lbl = '';
      this.socket.emit('add-carrito-add',{data:true});
    }
  }

}
