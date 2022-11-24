import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
    providedIn: 'root'
  })
export class VendedorService {

    public url;
  
    constructor(private _http: HttpClient,) { 
      this.url = GLOBAL.url;
    }
  
    login_admin(data:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.post(this.url+'login_vendedor',data,{headers:headers});
  
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
    
    registro_compra_manual_cliente(data:any,token:any):Observable<any>{
      let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
      return this._http.post(this.url+'registro_compra_manual_cliente',data,{headers:headers});
    }
    listar_clientes_tienda(token:any):Observable<any>{
      let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
      return this._http.get(this.url + 'listar_clientes_tienda',{headers:headers});
    }
    //venta
  obtener_ventas_admin(desde:any,hasta:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ventas_vendedor/'+desde+'/'+hasta,{headers:headers});
  }

  obtener_detalles_ordenes_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_detalles_ordenes_vendedor/'+id,{headers:headers});
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

  eliminar_orden_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'eliminar_orden_admin/'+id,{headers:headers});
  }
  marcar_envio_orden(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'marcar_envio_orden/'+id,data,{headers:headers});
  }

  confirmar_pago_orden(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'confirmar_pago_orden/'+id,data,{headers:headers});
  }
  listar_clientes_filtro_admin(tipo:any,filtro:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.get(this.url+'listar_clientes_filtro_vendedor/'+tipo+'/'+filtro,{headers:headers});

  }
  disminuir_cupon(cupon:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'disminuir_cupon/'+cupon,{headers:headers});
  }
  validar_cupon_admin(cupon:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'validar_cupon_admin/'+cupon,{headers:headers});
  }
  registro_cliente_admin(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.post(this.url+'registro_cliente_vendedor',data,{headers:headers});

  }

  obtener_cliente_admin(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_cliente_vendedor/'+id,{headers:headers});
  }

  actualizar_cliente_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.put(this.url+'actualizar_cliente_vendedor/'+id,data,{headers:headers});

  }

  desactivar_cliente_vendedor(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.put(this.url+'desactivar_cliente_vendedor/'+id,null,{headers:headers});

  }

  activar_cliente_vendedor(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.put(this.url+'activar_cliente_vendedor/'+id,null,{headers:headers});

  }

  listar_variedades_productos_admin(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_variedades_productos_admin',{headers:headers});
  }

  obtener_direccion_todos_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_direccion_todos_cliente/'+id,{headers:headers});
  }
}