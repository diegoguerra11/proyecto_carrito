import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVentasComponent } from './create-ventas.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
declare let $:any;

describe('CreateVentasComponent', () => {
    let component: CreateVentasComponent;
    let fixture: ComponentFixture<CreateVentasComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule,
                RouterTestingModule
            ],
            declarations: [ CreateVentasComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(CreateVentasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Debe crearse el componente', () => {
        expect(component).toBeTruthy();
    });

    
});
