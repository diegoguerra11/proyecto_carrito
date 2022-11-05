import { Routes, RouterModule } from  "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';

import { VendedorGuard } from "./guards/vendedor.guard";
import { IndexClienteComponent } from './components/clientes/index-cliente/index-cliente.component';
import { CreateClienteComponent } from './components/clientes/create-cliente/create-cliente.component';
import { EditClienteComponent } from './components/clientes/edit-cliente/edit-cliente.component';
import { IndexVentasComponent } from "./components/ventas/index-ventas/index-ventas.component";
import { CreateVentasComponent } from "./components/ventas/create-ventas/create-ventas.component";
import { ShowVentasComponent } from "./components/ventas/show-ventas/show-ventas.component";


const appRoute : Routes = [
    {path: '', redirectTo: 'inicio', pathMatch: 'full'},

    {path: 'inicio',component: InicioComponent, canActivate: [VendedorGuard]},

    {path: 'panel', children : [
        {path: 'clientes', component: IndexClienteComponent,canActivate: [VendedorGuard]},
        {path: 'clientes/registro', component: CreateClienteComponent,canActivate: [VendedorGuard]},
        {path: 'clientes/:id', component: EditClienteComponent,canActivate: [VendedorGuard]},


        {path: 'ventas', component: IndexVentasComponent, canActivate:[VendedorGuard]},
        {path: 'ventas/create', component: CreateVentasComponent, canActivate:[VendedorGuard]},
        {path: 'ventas/:id', component: ShowVentasComponent, canActivate:[VendedorGuard]},

    ]},

    {path: 'login',component: LoginComponent}
]

export const AppRoutingPorviders : any[]=[];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);