import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaProductoComponent } from './galeria-producto.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('GaleriaProductoComponent', () => {
    let component: GaleriaProductoComponent;
    let fixture: ComponentFixture<GaleriaProductoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule,
                RouterTestingModule
            ],
            declarations: [ GaleriaProductoComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GaleriaProductoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Debe crearse el componente', () => {
        expect(component).toBeTruthy();
    });

    
});
