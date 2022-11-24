import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { MessageBox } from 'src/app/utils/MessageBox';
import { AdminService } from '../../../services/admin.service';

declare let $:any;

@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent implements OnInit {

    public id;
    public token;
    public user;
    public producto:any = {};
    public inventarios: Array<any>=[];
    public arr_inventario : Array<any>=[];
    public variedades: any = [];
    public inventario : any = {}
    public page=1;
    public pageSize = 20;

    public load_btn = false;

  constructor(//se inyecta los servidores
    private _route: ActivatedRoute,
    private _productoService: ProductoService,
    private _adminService: AdminService
  ) { //se obtiene el token y el id
    this.token = localStorage.getItem('token');
    this.user = localStorage.getItem('usuario');
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this.obtener_producto(this.id);
        this.obtener_variedades(this.id);
        //obtiene los productos
        this.obtener_inventario(this.id);
      }
    );
  }

  //elimina el producto y salta un mensaje
  //   eliminar(id){
  //   this.load_btn = true;
  //   this._productoService.eliminar_inventario_producto_admin(id,this.token).subscribe(
  //     response=>{
  //       MessageBox.messageSuccess('Se eliminó correctamente el producto.');

  //       $('#delete-'+id).modal('hide');
  //       $('.modal-backdrop').removeClass('show');

  //       this.load_btn = false;

  //       this._productoService.listar_inventario_producto_admin(this.producto._id, this.token).subscribe(
  //         response=>{
  //           this.inventarios = response.data;


  //         },
  //         error=>{
  //           console.log(error);

  //         }

  //       )


  //     },
  //     error=>{//si no se pudo eliminar el producto saltara un mensaje
  //       MessageBox.messageError('Ocurrió un error en el servidor.');
  //       console.log(error);
  //       this.load_btn = false;
  //   }
  // )
  //   }

  //registra el inventario con el formato del inventari y lo valida
  registro_inventario(inventarioForm){
    let data = {
      producto: this.producto._id,
      cantidad: inventarioForm.value.cantidad,
      trabajador: this.user,
      variedad: inventarioForm.value.variedad,
      proveedor: inventarioForm.value.proveedor
    }
    this._productoService.registro_inventario_producto_admin(data,this.token).subscribe(
      response=>{
        MessageBox.messageSuccess('Se agrego el nuevo stock al producto');
        this.obtener_inventario(this.producto._id);
      },
      error=>{
        console.log(error);
      }
    )
  }

  //descarga el inventario en un excel
  download_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");

    worksheet.addRow(undefined);
    for (let x1  of this.inventarios){
      let x2=Object.keys(x1);

      let temp=[]
      for(let y of x2){
        temp.push(x1[y] as never)
      }
      worksheet.addRow(temp)
    }

    let fname='REP01- ';

    worksheet.columns = [
      { header: '_id', key: 'col1', width: 30},
      { header: 'Producto', key: 'col1', width: 30},
      { header: 'Variedad', key: 'col4', width: 25},
      { header: 'Cantidad', key: 'col2', width: 15},
      { header: 'Trabajador', key: 'col1', width: 30},
      { header: 'Proveedor', key: 'col3', width: 25},
      { header: 'timestamp', key: 'col3', width: 25},
      { header: '__v', key: 'col3', width: 25},
    ]as any;

    worksheet.spliceColumns(1,2);
    worksheet.spliceColumns(5,2);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
    });
  }

  obtener_variedades(id:any){
    this._adminService.listar_variedades_admin(id,this.token).subscribe(
      response => {
        if(!response.data){return MessageBox.messageError('Error al traer las variedades');}
        this.variedades = response.data;
      }
    )
  }

  obtener_producto(id:any) {
    this._productoService.obtener_producto_admin(id,this.token).subscribe(
      response => {
        this.producto = response.data
      }
    )
  }

  obtener_inventario(id:any) {
    this._productoService.listar_inventario_producto_admin(id, this.token).subscribe(
      response=>{
        this.inventarios = response.data;
      },
      error=>{
        console.log(error);
      }
    )
  }
}
