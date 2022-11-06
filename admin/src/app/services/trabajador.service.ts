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

  
}
