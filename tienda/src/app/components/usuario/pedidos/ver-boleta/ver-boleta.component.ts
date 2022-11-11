import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from '../../../../../../../admin/src/app/services/GLOBAL';

@Component({
  selector: 'app-ver-boleta',
  templateUrl: './ver-boleta.component.html',
  styleUrls: ['./ver-boleta.component.css']
})
export class VerBoletaComponent implements OnInit {

  public url: any;
  // public igv: any;
  public token: any;
  public orden: any = [];
  public detalles: Array<any> = [];
  public load_data = true;
  public id: any;
  public cliente:any = {};
  public direccion:any = {};
  public totalstar=5;
  public review : any={};
  public hayCupon = false;
  public valorCupon = 0;
  public IGV=0;

  constructor(
    private _clienteService: ClienteService,
    private _route: ActivatedRoute
  ) {

    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this._clienteService.verBoleta(this.id, this.token).subscribe(
          response => {
            this.orden = response.data;
            this.detalles = response.detalles;
              this.cliente = response.data.cliente;
              this.direccion = response.data.direccion;
              if(!response.data){
                this.orden = undefined;
              } else {
                this._clienteService.obtener_cupon_cliente(this.orden["cupon"],this.token).subscribe(
                  response=>{
                    console.log(response.data);
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
    )
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
  }

}

// <div class="col align-item-center mb-4 pb-1 pb-sm-3">
// <div class="row justify-content-center">
//   <h1 class="h1">Mi Cuenta</h1>
// </div>

// <div class="col ml-auto" *ngIf="orden">
//     <div class="d-flex align-items-center justify-content-between mb-4 pb-sm-2">
//       <h1 class="h2 mb-0">Mi Orden #{{ id.toUpperCase() }}</h1>

//     </div>

//     <div class="row">
//       <div class="col-12 mb-4">
//         <div class="card card-body py-3 box-shadow ">
//           <div class="row">
//             <div class="col-lg-6">
//               <table class="table mb-0">
//                 <caption></caption>
//                 <tbody>
//                    <tr>
//                     <th class="border-0 py-2 pl-0">Cliente:</th>
//                     <td class="border-0 py-2 px-0 text-muted">{{ cliente.nombres+' '+cliente.apellidos}}</td>
//                   </tr>
//                    <tr>
//                     <th class="border-0 py-2 pl-0">Documento:</th>
//                     <td class="border-0 py-2 px-0 text-muted">{{ cliente.numeroDocumento }}</td>
//                   </tr>
//                   <tr>
//                     <th class="border-0 py-2 pl-0">Telefono:</th>
//                     <td class="border-0 py-2 px-0 text-muted">{{ cliente.telefono }}</td>
//                   </tr>
//                   <tr>
//                     <th class="border-0 py-2 pl-0">Dirección:</th>
//                     <td class="border-0 py-2 px-0 text-muted">{{direccion.direccion}}</td>
//                   </tr>
//                   <tr>
//                     <th class="border-0 py-2 pl-0">Tipo:</th>
//                     <td class="border-0 py-2 px-0 text-muted">Boleta</td>
//                   </tr>
//                   <tr>
//                     <th class="border-0 py-2 pl-0">Método de pago:</th>
//                     <td class="border-0 py-2 px-0 text-muted">{{ orden.metodo_pago }}</td>
//                   </tr>
//                   <tr>
//                     <th class="border-0 py-2 pl-0">Fecha de compra</th>
//                     <td class="border-0 py-2 px-0 text-muted">{{ orden.createdAt | date }}</td>
//                   </tr>

//                 </tbody>
//               </table>
//             </div>

//             </div>
//           </div>

//         </div>
//       </div>
//       <div class="col-12">
//       </div>
//     </div>
// </div>

// <div class="col ml-auto" *ngIf="!orden">
//   <div class="col-lg-12 col-md-5">
//     <h3 class="h6 mb-2 text-uppercase">No se encontro la venta</h3>
//     <h2 class="h1 pb-lg-3">Es posible que sea un error</h2>
//   </div>
// </div>
