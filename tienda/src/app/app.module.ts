import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule }  from "@angular/common/http";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { RatingModule } from 'ng-starrating';

import { routing } from './app.routing';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { SiderbarComponent } from './components/usuario/siderbar/siderbar.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { ShowProductoComponent } from './components/productos/show-producto/show-producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { IndexPedidosComponent } from './components/usuario/pedidos/index-pedidos/index-pedidos.component';
import { PedidosDetallesComponent } from './components/usuario/pedidos/pedidos-detalles/pedidos-detalles.component';
import { VerificarPagoComponent } from './components/verificar-pago/verificar-pago.component';
import { EditDireccionComponent } from './components/usuario/edit-direccion/edit-direccion.component';
import { VerBoletaComponent } from './components/usuario/pedidos/ver-boleta/ver-boleta.component';
import { IndexReviewComponent } from './components/usuario/reviews/index-review/index-review.component';
import { RecuperarContraseniaComponent } from './components/recuperar-contrasenia/recuperar-contrasenia.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    PerfilComponent,
    SiderbarComponent,
    IndexProductoComponent,
    ShowProductoComponent,
    CarritoComponent,
    DireccionesComponent,
    IndexPedidosComponent,
    PedidosDetallesComponent,
    VerificarPagoComponent,
    EditDireccionComponent,
    VerBoletaComponent,
    IndexReviewComponent,
    RecuperarContraseniaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    routing,
    NgbPaginationModule,
    RatingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
