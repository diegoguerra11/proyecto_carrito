import { Routes, RouterModule } from  "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';

import { AuthGuard } from "./guards/auth.guard";
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { ShowProductoComponent } from './components/productos/show-producto/show-producto.component';
import { CarritoComponent } from "./components/carrito/carrito.component";
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { IndexPedidosComponent } from './components/usuario/pedidos/index-pedidos/index-pedidos.component';
import { PedidosDetallesComponent } from "./components/usuario/pedidos/pedidos-detalles/pedidos-detalles.component";
import { VerificarPagoComponent } from "./components/verificar-pago/verificar-pago.component";
import { EditDireccionComponent } from "./components/usuario/edit-direccion/edit-direccion.component";
import { VerBoletaComponent } from "./components/usuario/pedidos/ver-boleta/ver-boleta.component";
import { IndexReviewComponent } from "./components/usuario/reviews/index-review/index-review.component";
import { RecuperarContraseniaComponent } from './components/recuperar-contrasenia/recuperar-contrasenia.component';

const appRoute : Routes = [
    {path: '', component: InicioComponent},
    {path: 'login', component: LoginComponent},

    {path: 'cuenta/perfil', component: PerfilComponent, canActivate: [AuthGuard]},
    {path: 'cuenta/direcciones', component: DireccionesComponent, canActivate: [AuthGuard]},
    {path: "cuenta/direcciones/:id", component:EditDireccionComponent, canActivate: [AuthGuard]},
    {path: 'cuenta/pedidos', component: IndexPedidosComponent, canActivate: [AuthGuard]},
    {path: 'cuenta/pedidos/:id', component: PedidosDetallesComponent, canActivate: [AuthGuard]},
    {path: 'cuenta/pedidos/verBoleta/:id', component: VerBoletaComponent, canActivate: [AuthGuard]},
    {path: 'recuperar_contrasenia/:estado', component: RecuperarContraseniaComponent},
    {path: 'recuperar_contrasenia/:estado/:email', component: RecuperarContraseniaComponent},
        
    {path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard]},

    {path: 'cuenta/reviews', component: IndexReviewComponent, canActivate: [AuthGuard]},

    {path: 'verificar-pago/:tipo/:direccion/:cupon/:envio/:tipo_descuento/:valor_descuento/:total_pagar/:subtotal', component: VerificarPagoComponent},

    {path: 'productos', component: IndexProductoComponent},
    {path: 'productos/categoria/:categoria', component: IndexProductoComponent},
    {path: 'productos/:slug', component: ShowProductoComponent},
]

export const AppRoutingPorviders : any[]=[];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);
