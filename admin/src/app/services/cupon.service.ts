import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CuponService {

  public url;

  constructor(
    private _http: HttpClient,
  ) { 
    this.url = GLOBAL.url;

  }

  registro_cupon_admin(data,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.post(this.url+'registro_cupon_admin',data,{headers:headers});

  }

  listar_cupones_admin(filtro,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.get(this.url+'listar_cupones_admin/'+filtro,{headers:headers});

  }

  obtener_cupon_admin(id,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_cupon_admin/'+id,{headers:headers});

  }

  actualizar_cupon_admin(id,data,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.put(this.url+'actualizar_cupon_admin/'+id,data,{headers:headers});

  }

  activar_cupon_admin(id, token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.put(this.url+'activar_cupon_admin/'+id,null,{headers:headers});

  }

  desactivar_cupon_admin(id, token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.put(this.url+'desactivar_cupon_admin/'+id,null,{headers:headers});

  }

  validar_cupon_admin(cupon:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'validar_cupon_admin/'+cupon,{headers:headers});
  }
 
}
