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
  public user_lc : any = undefined;  

  public carrito_arr : Array<any> = [];
  public url;
  public subtotal = 0;
  public total_pagar = 0;
  public socket = io('http://localhost:4201');

  constructor(
    private _clienteService: ClienteService,
  ) { 

    this.idcliente = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');
    this.url =GLOBAL.url;


    
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
    this.carrito_arr.forEach((element: any) => {
 
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
     
      this.total_pagar=(this.total_pagar+this.subtotal/this.carrito_arr.length)
      
    });
    this.total_pagar = this.subtotal;
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
