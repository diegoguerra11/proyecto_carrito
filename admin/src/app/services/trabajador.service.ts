import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {

  public url: string;

  constructor(private _http: HttpClient,) { 
    this.url = GLOBAL.url;
  }

  listar_clientes_filtro_admin(tipo,filtro,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.get(this.url+'listar_trabajadores_filtro_admin/'+tipo+'/'+filtro,{headers:headers});
  }

  registrar_trabajador_admin(data,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.post(this.url+'registrar_trabajador_admin/', data, {headers:headers});
  }

  obtener_trabajador_admin(id, token): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url+'obtener_trabajador_admin/'+id,{headers: headers});
  }

  actualizar_trabajador_admin(id, data, token):Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'Application/json', 'Authorization':token});
    return this._http.put(this.url+'actualizar_trabajador_admin/'+id, data, {headers: headers});
  }

  actualizar_contraseña_admin(id, data, token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.put(this.url+'actualizar_contraseña_admin/'+id, data, {headers: headers});
  }

  desactivar_trabajador_admin(id, token):Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'Application/json', 'Authorization':token});
    return this._http.put(this.url+'desactivar_trabajador_admin/'+id, null, {headers: headers});
  }

  activar_trabajador_admin(id, token):Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'Application/json', 'Authorization':token});
    return this._http.put(this.url+'activar_trabajador_admin/'+id, null, {headers: headers});
  }

  get_Roles():Observable<any>{
    return this._http.get('./assets/roles.json');
  }
}
