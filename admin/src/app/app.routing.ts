import { Routes, RouterModule, CanActivate } from '@angular/router';
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';

import { AdminGuard } from './guards/admin.guard';
import { CreateProductoComponent } from './components/productos/create-producto/create-producto.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { UpdateProductoComponent } from './components/productos/update-producto/update-producto.component';
import { InventarioProductoComponent } from './components/productos/inventario-producto/inventario-producto.component';
import { CreateCuponComponent } from "./components/cupones/create-cupon/create-cupon.component";
import { IndexCuponComponent } from './components/cupones/index-cupon/index-cupon.component';
import { UpdateCuponComponent } from './components/cupones/update-cupon/update-cupon.component';
import { ConfigComponent } from "./components/config/config.component";
import { VariedadProductoComponent } from './components/productos/variedad-producto/variedad-producto.component';
import { GaleriaProductoComponent } from './components/productos/galeria-producto/galeria-producto.component';
import { IndexVentasComponent } from "./components/ventas/index-ventas/index-ventas.component";
import { ShowVentasComponent } from "./components/ventas/show-ventas/show-ventas.component";
import { IndexTrabajadorComponent } from './components/trabajador/index-trabajador/index-trabajador.component';
import { CreateTrabajadorComponent } from './components/trabajador/create-trabajador/create-trabajador.component';
import { EditTrabajadorComponent } from './components/trabajador/edit-trabajador/edit-trabajador.component';


const appRoute : Routes = [

    {path: '', redirectTo: 'inicio', pathMatch: 'full'},

    {path: 'inicio',component: InicioComponent, canActivate: [AdminGuard]},

    {path: 'panel', children : [
        {path: 'trabajadores', component:IndexTrabajadorComponent, canActivate: [AdminGuard]},
        {path: 'trabajadores/registro', component:CreateTrabajadorComponent, canActivate: [AdminGuard]},
        {path: 'trabajadores/:id', component:EditTrabajadorComponent, canActivate: [AdminGuard]},

        {path: 'productos/registro', component: CreateProductoComponent,canActivate: [AdminGuard]},
        {path: 'productos', component: IndexProductoComponent,canActivate: [AdminGuard]},
        {path: 'productos/:id', component: UpdateProductoComponent,canActivate: [AdminGuard]},
        {path: 'productos/inventario/:id', component: InventarioProductoComponent, canActivate: [AdminGuard]},
        {path: 'productos/variedades/:id', component: VariedadProductoComponent, canActivate: [AdminGuard]},
        {path: 'productos/galeria/:id', component: GaleriaProductoComponent, canActivate: [AdminGuard]},

        {path: 'cupones/registro', component: CreateCuponComponent,canActivate: [AdminGuard]},
        {path: 'cupones', component: IndexCuponComponent,canActivate: [AdminGuard]},
        {path: 'cupones/:id', component: UpdateCuponComponent, canActivate: [AdminGuard]},

        {path: 'ventas', component: IndexVentasComponent, canActivate:[AdminGuard]},
        {path: 'ventas/:id', component: ShowVentasComponent, canActivate:[AdminGuard]},

        {path: 'configuraciones', component: ConfigComponent, canActivate: [AdminGuard]},
    ]},

    {path: 'login',component: LoginComponent}
]

export const AppRoutingPorviders : any[]=[];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);