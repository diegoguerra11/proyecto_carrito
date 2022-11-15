import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    this.url = GLOBAL.url;

  }

  login_cliente(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'login_cliente',data,{headers:headers});
  }

  confirmar_correo(user:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'confirmar_correo',user,{headers:headers});
  }

  cambiar_contrasenia(user:any):Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.put(this.url+'cambiar_contrasenia',user,{headers:headers});
  }

  getToken(){
    return localStorage.getItem('token');
  }

  obtener_cliente_guest(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_cliente_guest/'+id,{headers:headers});
  }

  actualizar_perfil_cliente_guest(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'actualizar_perfil_cliente_guest/'+id,data,{headers:headers});
  }

  public isAuthenticated():boolean{

    const token:any = localStorage.getItem('token');

    if(!token){
      return false;
    }

    try{
      const helper = new JwtHelperService();
      let decodedToken = helper.decodeToken(token);

      console.log(decodedToken);
      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }

    if(!decodedToken){
      localStorage.clear();
      return false;
      }

    }catch (error){
      localStorage.clear();
      return false;
    }

    return true;
  }

  obtener_config_publico():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_config_publico',{headers:headers});

  }

  listar_productos_publico(filtro:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'listar_productos_publico/'+filtro,{headers:headers});

  }

  agregar_carrito_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'agregar_carrito_cliente',data,{headers:headers});
  }

  obtener_carrito_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_carrito_cliente/'+id,{headers:headers});
  }

  eliminar_carrito_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'eliminar_carrito_cliente/'+id,{headers:headers});
  }

  //Direcciones
  registro_direccion_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url + 'registro_direccion_cliente',data,{headers:headers});
  }

  obtener_direccion_todos_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'obtener_direccion_todos_cliente/' + id,{headers:headers});
  }

  cambiar_direccion_principal_cliente(id:any,cliente:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url + 'cambiar_direccion_principal_cliente/' + id + '/' + cliente,{data:true},{headers:headers});
  }

  eliminar_direccion_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url + 'eliminar_direccion_cliente/' + id,{headers:headers});
  }

  registro_cliente(data:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this._http.post(this.url + 'registro_cliente',data,{headers:headers});
  }

  obtener_direccion_principal_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url + 'obtener_direccion_principal_cliente/' + id,{headers:headers});
  }

  //compra
  registro_pedido_compra_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'registro_pedido_compra_cliente',data,{headers:headers});
  }
  enviar_correo_compra_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'enviar_correo_compra_cliente/'+id,{headers:headers});
  }
  registro_compra_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'registro_compra_cliente',data,{headers:headers});
  }

  //Pedidos
  obtener_ordenes_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ordenes_cliente/'+id,{headers:headers});
  }

  obtener_detalles_ordenes_cliente(id: any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_detalles_ordenes_cliente/'+id,{headers:headers});
  }

  verBoleta(id: any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'verBoleta/'+id,{headers:headers});
  }

  //culqi
  get_token_culqi(data:any):Observable<any>{
    let headers = new HttpHeaders()
    .set('Content-Type','application/json')
    .set('Authorization','Bearer pk_test_0b07aceaa3de8c43');
    return this._http.post('https://secure.culqi.com/v2/tokens',data,{headers:headers});
  }

  get_charge_culqi(data:any):Observable<any>{
    let headers = new HttpHeaders()
    .set('Content-Type','application/json')
    .set('Authorization','Bearer sk_test_56683314fd8a5328');
    return this._http.post('https://api.culqi.com/v2/charges',data,{headers:headers});
  }

  consultarIDPago(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'consultarIDPago/'+id,{headers:headers});
  }

  validar_cupon_admin(cupon:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'validar_cupon_admin/'+cupon,{headers:headers});
  }

  disminuir_cupon(cupon:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'disminuir_cupon/'+cupon,{headers:headers});
  }

  listar_productos_nuevos_publico():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'listar_productos_nuevos_publico',{headers:headers});
  }


  obtener_cupon_cliente(cupon:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_cupon_cliente/'+cupon,{headers:headers});

  }
  actualizar_direccion_cliente(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'actualizar_direccion_cliente/'+id,data,{headers:headers});
  }
  recibir_direccion_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});

    return this._http.get(this.url + 'recibir_direccion_cliente/' + id ,{headers:headers});
  }

  //RESEÑAS
  emitir_review_producto_cliente(data: any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'emitir_review_producto_cliente',data,{headers:headers});
  }
  obtener_review_producto_cliente(id:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_review_producto_cliente/'+id,{headers:headers});
  }
  obtener_reviews_cliente(id: any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_reviews_cliente/'+id,{headers:headers});
  }
}
