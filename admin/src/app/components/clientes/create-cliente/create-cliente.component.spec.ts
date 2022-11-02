import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClienteComponent } from './create-cliente.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('CreateClienteComponent', () => {
    let component: CreateClienteComponent;
    let fixture: ComponentFixture<CreateClienteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule,
                RouterTestingModule
            ],
            declarations: [ CreateClienteComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(CreateClienteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Debe crearse el componente', () => {
        expect(component).toBeTruthy();
    });

    it('Manda los datos del formulario', () => {
        const fixture = TestBed.createComponent(CreateClienteComponent);
        const app = fixture.componentInstance;
        fixture.detectChanges();

        app.cliente.genero = 'Masculino';
        app.cliente.nombres = 'Diego';
        app.cliente.apellidos = 'Guerra';
        app.cliente.f_nacimiento = '2001/05/12';
        app.cliente.telefono = '123456789';
        app.cliente.dni = '114555441';
        app.cliente.email = 'diego45@gmail.com';

        const btnElement = fixture.debugElement.query(By.css('button.btn.btn-primary'));
        btnElement.nativeElement.click();
        const testData = {
            genero: 'Masculino',
            nombres: 'Diego',
            apellidos: 'Guerra',
            f_nacimiento: '2001/05/12',
            telefono: '123456789',
            dni: '114555441',
            email: 'diego45@gmail.com'
        }
        expect(app.cliente).toEqual(testData);
    });
});
