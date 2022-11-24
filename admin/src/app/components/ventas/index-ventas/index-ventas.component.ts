import { Component, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import { AdminService } from 'src/app/services/admin.service';
import * as fs from 'file-saver';

@Component({
  selector: 'app-index-ventas',
  templateUrl: './index-ventas.component.html',
  styleUrls: ['./index-ventas.component.css']
})
export class IndexVentasComponent implements OnInit {

  public ventas : Array<any>=[];
  public const_ventas : Array<any>=[];
  public token = localStorage.getItem('token');
  public page = 1;
  public pageSize = 25;
  public filtro = '';
  public desde :any = undefined;
  public hasta :any = undefined;
  public load = false;
  public arr_ventas: Array<any> = [];

  constructor(//inyecta los servidores
    private _adminService:AdminService
  ) { }
//obtiene las ventas
  ngOnInit(): void {
    this.load = true;
    this._adminService.obtener_ventas_admin(this.desde, this.hasta, this.token).subscribe(
      response=>{
        this.ventas = response.data;
        this.const_ventas = this.ventas;
        this.load = false;
        this.ventas.forEach(element => {
          this.arr_ventas.push({
            clienteNombre: element.cliente.nombres,
            clienteApellido: element.cliente.apellidos,
            createdAt: element.createdAt,
            subtotal: element.subtotal,
            metodo_pago: element.metodo_pago,
            estado: element.estado
          })
        });
      }
    );
  }
//filta las ventas
  filtrar_ventas(){
    if(this.filtro){
      let term = new RegExp(this.filtro.toString().trim() , 'i');
      this.ventas = this.const_ventas.filter(item=>term.test(item._id)||term.test(item.cliente.email)||term.test(item.cliente.apellidos)||term.test(item.dni));
    }else{
      this.ventas = this.const_ventas;
    }
  }
//filtro de ventas por fechas
  filtrar_fechas(){

    if(this.desde||this.hasta){
      this.ventas = [];
      let tt_desde = Date.parse(new Date(this.desde+'T00:00:00').toString())/1000;
      let tt_hasta = Date.parse(new Date(this.hasta+'T23:59:59').toString())/1000;

      for(let item of this.const_ventas){
          let tt_created = Date.parse(new Date(item.createdAt).toString())/1000;
          if(tt_created >= tt_desde && tt_created <= tt_hasta){
              this.ventas.push(item);
          }
      }
    }else{
      this.ventas = this.const_ventas;
    }
  }
  download_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de pedidos");

    worksheet.addRow(undefined);
    for (let x1 of this.arr_ventas){
      let x2=Object.keys(x1);

      let temp=[]
      for(let y of x2){
        temp.push(x1[y] as never)
      }
      worksheet.addRow(temp)
    }

    let fname='REP01- ';

    worksheet.columns = [
      { header: 'Nombres', key: 'col1', width: 30},
      { header: 'Apellidos', key: 'col2', width: 30},
      { header: 'Fecha', key: 'col3', width: 15},
      { header: 'Monto', key: 'col4', width: 15},
      { header: 'Método', key: 'col5', width: 25},
      { header: 'Estado', key: 'col6', width: 15},
    ]as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
    });
  }
//resetea los datos del filtro fecha
  reset_data(){
    this.desde = '';
    this.hasta = '';
    this.ventas = this.const_ventas;
  }

}
