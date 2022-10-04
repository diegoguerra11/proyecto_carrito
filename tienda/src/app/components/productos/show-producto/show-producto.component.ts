import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GuestService } from '../../../services/guest.service';
import { ClienteService } from '../../../services/cliente.service';
import { io } from "socket.io-client";

declare var tns:any;
declare var lightGallery:any;
declare var iziToast:any;

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {

  public token:any;
  public slug:any;
  public producto:any = {};
  public url:any;
  public productos_rec : Array<any> = [];

  public user_lc : any = undefined;

  public carrito_data : any = {
    variedad: '',
    cantidad: 1,
  };

  public btn_cart = false;
  public socket = io('http://localhost:4201');

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
          lightGallery(e[t], { selector: ".cs-gallery-item", download: !1, videojs: !0, youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 }, vimeoPlayerParams: { byline: 0, portrait: 0 } });
        }
      }

      tns({
        container: '.cs-carousel-inner-two',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        nav: false,
        controlsContainer: "#custom-controls-related",
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          480: {
            items: 2,
            gutter: 24
          },
          700: {
            items: 3,
            gutter: 24
          },
          1100: {
            items: 4,
            gutter: 30
          }
        }
      });
    },500) 

  }

  agregar_producto(){
    if (this.carrito_data.variedad) {
      if (this.carrito_data.cantidad <= this.producto.stock) {
        let data={
          producto: this.producto._id,
          cliente: localStorage.getItem('_id'),
          cantidad: this.carrito_data.cantidad,
          variedad: this.carrito_data.variedad,
        }
        this.btn_cart = true;
        this._clienteService.agregar_carrito_cliente(data,this.token).subscribe(
          response=>{
            if (response.data == undefined) {
              iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                color: '#FFF',
                class: 'text-danger',
                position: 'topRight',
                message: 'El producto ya existe en el carrito'
            });
            this.btn_cart = false;
            }else{
              console.log(response);
              iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Se agrego el producto al carrito'
            });
            this.socket.emit('add-carrito-add',{data: true});
            this.btn_cart = false;
            }
          }
        );
      }else{
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'La maxima cantidad disponible es:' + this.producto.stock
      });
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Seleccione una variedad de producto'
    });
    }
  }

  agregar_producto_guest(){
    if(this.carrito_data.variedad){
     

      if(this.carrito_data.cantidad >= 1){
        if(this.carrito_data.cantidad <= this.carrito_data.stock){
          let data = {
            producto: this.producto,
            variedad: this.carrito_data,
            cantidad: this.carrito_data.cantidad,
          }
          let ls_carrito_guest = localStorage.getItem('cart');
          if(ls_carrito_guest == null){
            let arr_carrito = [];
            arr_carrito.push(data);
            localStorage.setItem('cart',JSON.stringify(arr_carrito));
          }else{
            let arr_carrito = JSON.parse(ls_carrito_guest);
            localStorage.removeItem('cart');
            arr_carrito.push(data);
            localStorage.setItem('cart',JSON.stringify(arr_carrito));
          }
  
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agregó el producto a tu carrito.'
          });
  
          this.carrito_data= {
            id: '',
            stock: 0,
            variedad: ''
          }
          this.carrito_data.cantidad = 0;
          this.carrito_data.variedad = '';
          this.socket.emit('add-carrito-add',{data:true});
        }else{
          iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'La cantidad máxima del producto es.' + this.carrito_data.stock
          });
        }
      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Ingrese una cantidad valida.'
        });
      }
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Seleccione una variedad de producto.'
      });
    }
  }

}
