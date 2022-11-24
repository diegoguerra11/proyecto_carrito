import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GuestService } from '../../../services/guest.service';
import { ClienteService } from '../../../services/cliente.service';
import { io } from "socket.io-client";
import { MessageBox } from 'src/app/Utils/MessageBox';
import { ValidationsProducto } from '../../../validations/validationsProducto';

declare let tns:any;
declare let lightGallery:any;

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {

  public token:any;
  public reviews :Array<any> = [];
  public page = 1;
  public pageSize = 15;
  public option_nav = 3;

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
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.slug = params['slug'];
        this._guestService.obtener_productos_slug_publico(this.slug).subscribe(
          response=>{
            this.producto = response.data;
            this.init_variedades();
            this._guestService.listar_productos_recomendados_publico(this.producto.categoria).subscribe(
              response=>{
                this.productos_rec = response.data;
              }
            );
            this._guestService.obtener_reviews_producto_publico(this.producto._id).subscribe(
              response=>{
                
                this.reviews = response.data;
                console.log(this.reviews);
              }
            );

          }
        );
      }
    );

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

      let e = document.querySelectorAll(".cs-gallery");
      if (e.length){
        for (let t = 0; t < e.length; t++){
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

change_option(op:any){
    this.option_nav = op;
  }

  init_variedades(){
    this._guestService.obtener_variedades_productos_cliente(this.producto["_id"]).subscribe(
      response=>{
        this.variedades = response.data;
      }
    );
  }

  select_variedad(){
    let arr_variedad = this.select_variedad_lbl.split('_');
    this.obj_variedad_select.id = arr_variedad[0];
    this.obj_variedad_select.variedad = arr_variedad[1];
    this.obj_variedad_select.stock = arr_variedad[2];
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
    if(!ValidationsProducto.agregarAcarrito(this.carrito_data, this.obj_variedad_select)) {return;}
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
          return MessageBox.messageError('Producto Agregado Anteriormente');
        }
        MessageBox.messageSuccess('Se agregó el producto al carrito.');
        this.socket.emit('add-carrito-add',{data:true});
        this.btn_cart =false;
      }
    );
  }

  agregar_producto_guest(){
    if(!ValidationsProducto.agregarAcarrito(this.carrito_data, this.obj_variedad_select)) {return;}
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
        productoEnCarrito = data.variedad['id'] == element.variedad["id"];
      }
      if(productoEnCarrito) {return MessageBox.messageError('Producto Ingresado previamente en el carrito');}
      let arr_carrito = JSON.parse(ls_carrito_guest);
      localStorage.removeItem('cart');
      arr_carrito.push(data);
      localStorage.setItem('cart',JSON.stringify(arr_carrito));
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
