import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url;

  constructor(private _http: HttpClient,) { 
    this.url = GLOBAL.url;
  }

  login_admin(data):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'login_admin',data,{headers:headers});

  }

  getToken(){
    return localStorage.getItem('token');
  }

  //VALIDACION
  public isAuthenticated(allowRoles: string[]):boolean{

    const token:any = localStorage.getItem('token');

    if(!token){
      return false;
    }

    const helper = new JwtHelperService();
    let decodedToken = helper.decodeToken(token);
    try{
      
      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }

    if(!decodedToken){
      console.log('NO ES VALIDO');
      localStorage.removeItem('token');
      return false;
      }

    }catch (error){
      localStorage.removeItem('token');
      return false;
    }
    
    return allowRoles.includes(decodedToken['role']);
  }

  actualizar_config_admin(id,data,token):Observable<any>{
    if(data.logo){
      let headers = new HttpHeaders({'Authorization':token});

      const fd = new FormData();
      fd.append('titulo',data.titulo);
      fd.append('serie',data.serie);
      fd.append('correlativo',data.correlativo);
      fd.append('categorias',JSON.stringify(data.categorias));
      fd.append('logo',data.logo);
      return this._http.put(this.url+'actualizar_config_admin/'+id,fd,{headers:headers});
    }else{
      let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
      return this._http.put(this.url+'actualizar_config_admin/'+id,data,{headers:headers});
    }
    
  }

  obtener_config_admin(token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_config_admin',{headers:headers});
  }

  obtener_config_publico():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_config_publico',{headers:headers});

  }

  registro_compra_manual_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'registro_compra_manual_cliente',data,{headers:headers});
  }

  listar_variedades_productos_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_variedades_productos_admin',{headers:headers});
  }

  obtener_direccion_todos_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_direccion_todos_cliente/'+id,{headers:headers});
  }
  listar_clientes_tienda(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'listar_clientes_tienda',{headers:headers});
  }


  //venta
  obtener_ventas_admin(desde,hasta,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ventas_admin/'+desde+'/'+hasta,{headers:headers});
  }

  obtener_detalles_ordenes_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_detalles_ordenes_cliente/'+id,{headers:headers});
  }

  obtenerPago(id:any):Observable<any>{
    let headers = new HttpHeaders()
    .set('Content-Type','application/json')
    .set('Authorization','Bearer TEST-1565437970717712-100416-3da5767dad6b8dfef6c0563925dadf81-612621626');
    return this._http.get('https://api.mercadopago.com/v1/payments/'+id,{headers:headers});
  }

  marcar_finalizado_orden(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'marcar_finalizado_orden/'+id,data,{headers:headers});
  }

  cancelar_orden_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'cancelar_orden_admin/'+id,null,{headers:headers});
  }
  marcar_envio_orden(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'marcar_envio_orden/'+id,data,{headers:headers});
  }

  confirmar_pago_orden(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'confirmar_pago_orden/'+id,data,{headers:headers});
  }

  //variedades


  actualizar_producto_variedades_admin(data:any,id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'actualizar_producto_variedades_admin/'+id,data,{headers:headers});
  }


  listar_variedades_admin(id:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.get(this.url + 'listar_variedades_admin/'+id,{headers:headers});
  }

  eliminar_variedad_admin(id:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.delete(this.url+'eliminar_variedad_admin/'+id,{headers:headers});
  }

  agregar_nueva_variedad_admin(data:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.post(this.url+'agregar_nueva_variedad_admin',data,{headers:headers});
  }

  cambiar_vs_producto_admin(id:any,estado:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.get(this.url+'cambiar_vs_producto_admin/'+id+'/'+estado,{headers:headers});
  }

  //kpis
  kpi_ganancias_mensuales_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'kpi_ganancias_mensuales_admin',{headers:headers});
  }
  
}
