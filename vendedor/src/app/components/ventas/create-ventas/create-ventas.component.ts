import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendedorService } from 'src/app/services/vendedor.service';
import { ValidatonsCliente } from 'src/app/validations/validationsCliente';
import { MessageBox} from "../../../utils/MessageBox";
declare let $:any;
@Component({
  selector: 'app-create-ventas',
  templateUrl: './create-ventas.component.html',
  styleUrls: ['./create-ventas.component.css']
})
export class CreateVentasComponent implements OnInit {

  public direccion_seleccionada = false;
  public load_btn = false;
  public clientes_const:Array<any> = [];
  public load_data = false;
  public token = localStorage.getItem('token');
  public filtro_cliente = '';
  public clientes:Array<any> = [];
  public pageCliente = 1;
  public pageSizeCliente = 20;
  public load_clientes = false;
  public direcciones:Array<any> = [];
  public pageDireccion = 1;
  public pageSizeDireccion = 20;
  public load_direcciones = false;
  public direccion_select : any = {};
  public variedades:Array<any> = [];
  public variedades_const:Array<any> = [];
  public pageVariedad = 1;
  public pageSizeVariedad = 20;
  public load_variedades= false;
  public producto_select :any= undefined;
  public cantidad = 1;
  public cuponTemporal = "";
  public cuponAgregado = false;
  public tipo_descuento = "";
  public valor_descuento = 0
  public totalAPagarMovible = 0;
  public totalAPagarEstatico = 0;
  public venta :any = {
    metodo_pago: ''
  };
  public cliente: any = {
    genero: ''
  };
  public dventa:Array<any> = [];
  public total_pagar = 0;
  public envio_input = 0;
  public neto_pagar = 0;
  public filtro_producto = '';
  public descuento = 0;
  public clienteTemporal = false;
  public direccionTienda = {

    cliente: "ClienteTienda",
    destinatario: "Cliente",
    numeroDocumento: "ClienteNumDoc",
    tipoDocumento: "ClienteTipoDoc",
    zip: "012200",
    direccion: "Tienda",
    pais: "Perú",
    telefono: "ClienteTelefono",
    principal: false

  }


  constructor(
    private _vendedorService:VendedorService,
    private _router:Router
  ) {

  }

  ngOnInit(): void {
    this.init_cliente();
    this.init_productos();
  }

  init_cliente(){
    this.load_clientes = true;
    this._vendedorService.listar_clientes_tienda(this.token).subscribe(
      (response:any)=>{
        this.clientes = response.data;
        this.clientes_const = this.clientes;
        this.load_clientes = false;
      },
    );
  }

  func_filtro_cliente(){
    if(this.filtro_cliente){
      let term = new RegExp(this.filtro_cliente.toString().trim() , 'i');
      this.clientes = this.clientes_const.filter(item=>term.test(item.nombres)||term.test(item.apellidos)||term.test(item.email)||term.test(item.dni));
    }else{
      this.clientes = this.clientes_const;
    }
  }

  func_filtro_producto(){
    if(this.filtro_producto){
      let term = new RegExp(this.filtro_producto.toString().trim() , 'i');
      this.variedades = this.variedades_const.filter(item=>term.test(item.producto));
    }else{
      this.variedades = this.variedades_const;
    }
  }
  
  select_cliente_temporal(registroForm:any){
    if(!ValidatonsCliente.verificarClienteTemporal(registroForm.form.value)){return;}
    
    this._vendedorService.registro_cliente_admin(this.cliente,this.token).subscribe(
      response =>{
        if(!response.data){
          this.cliente ={
            genero: '',
            nombres: '',
            apellidos:  '',
            f_nacimiento: '',
            telefono: '',
            tipoDocumento: '',
            dni:  '',
            email: ''
          }
          return MessageBox.messageError("El numero documento ya existe");
        }
        console.log(response.data._id);
        this.venta.cliente = response.data._id;
        MessageBox.messageSuccess("Cliente registrado satisfactoriamente");
        this.cliente ={
          genero: '',
          nombres: '',
          apellidos: '',
          f_nacimiento: '',
          telefono: '',
          dni: '',
          email: ''
        }
        $('#modalClienteTemporal').modal('hide');
        $('#input-cliente').val(registroForm.form.value.nombres + " " + registroForm.form.value.apellidos);
      },
      error=>{
        console.log(error);
      }
    );
   
  }
  select_cliente(item:any){
    if(item != "temporal"){
    this.venta.cliente = item._id;
    $('#modalCliente').modal('hide');
    $('#input-cliente').val(item.nombres+' '+item.apellidos);
    this.init_direcciones(item._id);
    this.clienteTemporal = false;}

    this.clienteTemporal = true;
    $('#modalCliente').modal('hide');
  }

  init_direcciones(id:any){
    this.load_direcciones = true;
    this._vendedorService.obtener_direccion_todos_cliente(id,this.token).subscribe(
      (response:any)=>{
        this.direcciones = response.data;
        this.load_direcciones = false;
      }
    );
  }

  select_direccion(item:any){
    if(item == "tienda"){
    
      this.direccion_select = this.direccionTienda;
      $('#modalDireccion').modal('hide');
      $('#input-direccion').val("Tienda");
      this.direccion_seleccionada = true;
    }
    else{
      console.log(item._id);
    this.direccion_select = item;
    this.venta.direccion = item._id;
    $('#modalDireccion').modal('hide');
    $('#input-direccion').val(item.direccion);
    this.calcular_envio();
  this.direccion_seleccionada = true}
    
  }

  init_productos(){
    this.load_variedades = true;
    this._vendedorService.listar_variedades_productos_admin(this.token).subscribe(
      (response:any)=>{
          response.data.forEach((element:any) => {
              this.variedades.push({
                idvariedad: element._id,
                idproducto: element.producto._id,
                producto:element.producto.titulo,
                categoria: element.producto.categoria,
                variedad: element.valor,
                cantidad: element.stock,
                precio_soles: element.producto.precio,
                precio_dolar: element.producto.precio_dolar,
                nventas : element.producto.nventas,
              })
          });
          this.variedades_const = this.variedades;
          this.load_variedades = false;
      },
    )
  }

  select_producto(item:any){
    this.producto_select = item;
    $('#modalProducto').modal('hide');
    $('#input-producto').val(item.producto);
  }

  addProducto(){
    if(this.producto_select != undefined){
      if(this.cantidad >= 1){
        if(this.cantidad <= this.producto_select.cantidad){
          this.dventa.push({
            titulo_producto: this.producto_select.producto,
            precio_und: this.producto_select.precio_soles,
            titulo_variedad: this.producto_select.variedad,
            producto: this.producto_select.idproducto,
            subtotal: this.producto_select.precio_soles * this.cantidad,
            variedad: this.producto_select.idvariedad,
            cantidad: this.cantidad
          });
          this.total_pagar = this.total_pagar + (this.producto_select.precio_soles * this.cantidad);
          this.neto_pagar = this.neto_pagar + (this.producto_select.precio_soles * this.cantidad);
        }else{
          MessageBox.messageError('La cantidad sobrepasa el stock');
        }
      }else{
        MessageBox.messageError('Ingrese un valor valido en la cantidad');
      }
    }else{
      MessageBox.messageError('Seleccione el producto');
    }
  }

  calcular_envio(){
    this.neto_pagar = this.neto_pagar - this.envio_input;
    if(this.direccion_select.direccion == "Tienda"){
      this.envio_input = 0;
    }
    else if(this.direccion_select.pais == 'Perú'){
      if(this.direccion_select.region == 'Lima'){
        this.envio_input = 10;
      }else if(this.direccion_select.region != 'Lima'){
        this.envio_input = 15;
      }
    }

    this.neto_pagar = this.neto_pagar + this.envio_input;
  }

  quitar(id:any,precio:any){
    this.dventa.splice(id,1);
    this.total_pagar = this.total_pagar - precio;
    this.neto_pagar = this.neto_pagar - precio;
  }

  registrar_venta(){
    this.venta.envio_precio = this.envio_input;
    this.venta.subtotal = this.neto_pagar - this.venta.envio_precio;
    this.venta.total_pagar = this.neto_pagar;
    this.venta.currency = 'PEN';
    this.venta.transaccion = 'VENTAMANUAL';
    this.venta.estado = "Finalizado";
    this.venta.detalles = this.dventa;
    this.venta.tracking = "Recojo en Tienda";
    this.venta.valor_descuento = this.valor_descuento;
    if(!this.venta.cliente){
      MessageBox.messageError('Debe seleccionar al cliente.');

    }else if(!this.direccion_seleccionada){
      MessageBox.messageError('Debe seleccionar la dirección.');

    }else if(!this.venta.metodo_pago){
      MessageBox.messageError('Debe seleccionar el metodo de pago.');

    }
    else if(this.dventa.length == 0){
      MessageBox.messageError('Debe agregar al menos un producto a la venta.');

    }else{
      this.load_btn = true;
      if(!this.cuponAgregado){
        this.venta.cupon = "undefined";
      }
      this._vendedorService.registro_compra_manual_cliente(this.venta,this.token).subscribe(
        (response:any)=>{
          if(this.cuponAgregado){
          this._vendedorService.disminuir_cupon(this.venta.cupon, this.token).subscribe(
            response=>{
              console.log("miau");
              console.log(response);
              this.load_btn = false;
              this._router.navigate(['/panel/ventas']);
            }
            
          );}
          else{
            this.load_btn = false;
            this._router.navigate(['/panel/ventas']);
          }
        
        }
      );

    }

  }

  aplicarDescuento(){
    if(this.cuponTemporal != "") {return MessageBox.messageError("Solo se puede canjear un cupón por compra");}
    if(!this.venta.cupon) {return MessageBox.messageError('El cupon no es valido.');}
    if(this.venta.cupon.toString().length > 25) {return MessageBox.messageError('El cupon debe ser menos de 25 caracteres.');}
    this._vendedorService.validar_cupon_admin(this.venta.cupon,this.token).subscribe(
      response=>{
        if(!response.data){return MessageBox.messageError(response.message);}
        this.cuponAgregado = true;
        this.totalAPagarEstatico = this.neto_pagar;
        this.tipo_descuento =  response.data.tipo;
        if(response.data.tipo == 'Valor Fijo'){
          this.descuento = response.data.valor;
          let descuentoLocal = response.data.valor;
          console.log(descuentoLocal);
          this.valor_descuento = this.descuento;
          this.totalAPagarMovible = (this.totalAPagarEstatico - descuentoLocal);

        }
        if(response.data.tipo == 'Porcentaje'){
          let descuentoLocal = response.data.valor;
          this.descuento =Math.round((this.totalAPagarEstatico * descuentoLocal)/100);
          
          this.valor_descuento = this.descuento;
          this.totalAPagarMovible = (this.totalAPagarEstatico - this.valor_descuento);
        }
        this.cuponTemporal = this.venta.cupon;
        console.log(this.neto_pagar);
        console.log(this.totalAPagarMovible);
        this.neto_pagar = this.totalAPagarMovible;
        console.log(this.neto_pagar);
        MessageBox.messageSuccess("Cupón " + this.venta.cupon + " fue canjeado con éxito");
        
      }
    );
  }

}
