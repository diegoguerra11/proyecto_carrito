import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { VendedorService } from "src/app/services/vendedor.service";


@Injectable({
  providedIn: 'root'
})
export class VendedorGuard implements CanActivate {

  constructor(
    private _vendedorService:VendedorService,
    private _router:Router
  ){

  }

  canActivate():any{
    if(!this._vendedorService.isAuthenticated(['vendedor'])){
        this._router.navigate(['/login']);
        return false;
    }
    return true;
  }

}
