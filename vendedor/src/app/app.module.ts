import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule }  from "@angular/common/http"
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap"
import { NgxTinymceModule } from 'ngx-tinymce';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { routing }  from "./app.routing";
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { CreateClienteComponent } from './components/clientes/create-cliente/create-cliente.component';
import { EditClienteComponent } from './components/clientes/edit-cliente/edit-cliente.component';
import { IndexClienteComponent } from './components/clientes/index-cliente/index-cliente.component';
import { IndexVentasComponent } from './components/ventas/index-ventas/index-ventas.component';
import { CreateVentasComponent } from './components/ventas/create-ventas/create-ventas.component';
import { ShowVentasComponent } from './components/ventas/show-ventas/show-ventas.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    CreateClienteComponent,
    EditClienteComponent,
    IndexClienteComponent,
    IndexVentasComponent,
    CreateVentasComponent,
    ShowVentasComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    routing,
    NgbPaginationModule,
    NgxTinymceModule.forRoot({
      baseURL: '../../../assets/tinymce/'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
