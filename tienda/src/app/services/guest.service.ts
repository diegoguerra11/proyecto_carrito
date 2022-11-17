import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    this.url = GLOBAL.url;

  }
  obtener_productos_slug_publico(slug:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_productos_slug_publico/'+slug,{headers:headers});

  }

  listar_productos_recomendados_publico(categoria:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'listar_productos_recomendados_publico/'+categoria,{headers:headers});
  }


  listar_productos_nuevos_publico():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'listar_productos_nuevos_publico/',{headers:headers});
  }


  listar_productos_masvendidos_publico():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'listar_productos_masvendidos_publico/',{headers:headers});
  }

  comprobar_carrito_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'comprobar_carrito_cliente',data,{headers:headers});
  }

  obtener_variedades_productos_cliente(id:any):Observable<any>{
    console.log(id);
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_variedades_productos_cliente/'+id,{headers:headers});
  }

  agregar_carrito_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'agregar_carrito_cliente',data,{headers:headers});
  }

  actualizar_cantidad_carrito_cliente(id:any, stock:any, token:any) {
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'actualizar_cantidad_carrito_cliente/'+id+'/'+stock,null,{headers:headers});
  }
  obtener_reviews_producto_publico(id:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_reviews_producto_publico/'+id,{headers:headers});
  }
  get_categorias():Observable<any>{
    return this._http.get('./assets/categorias.json');
  }

  obtener_descuento_activo():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_descuento_activo',{headers:headers});
  }

  //Mercado pago

  createToken(data:any):Observable<any>{
    let headers = new HttpHeaders()
    .set('Content-Type','application/json')
    .set('Authorization','Bearer TEST-1565437970717712-100416-3da5767dad6b8dfef6c0563925dadf81-612621626');
    return this._http.post('https://api.mercadopago.com/checkout/preferences',data,{headers:headers});
  }

  //Regiones
  get_Regiones():Observable<any>{
    return this._http.get('./assets/regiones.json');
  }
  get_Distritos():Observable<any>{
    return this._http.get('./assets/distritos.json');
  }
  get_Provincias():Observable<any>{
    return this._http.get('./assets/provincias.json');
  }
  get_Envios():Observable<any>{
    return this._http.get('./assets/envios.json');
  }

  //Orden de Pedido
  registro_pedido_compra_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'registro_pedido_compra_cliente',data,{headers:headers});
  }
}
