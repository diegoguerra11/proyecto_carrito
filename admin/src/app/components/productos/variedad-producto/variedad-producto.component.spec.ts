import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariedadProductoComponent } from './variedad-producto.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
declare let $:any;

describe('VariedadProductoComponent', () => {
    let component: VariedadProductoComponent;
    let fixture: ComponentFixture<VariedadProductoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule,
                RouterTestingModule
            ],
            declarations: [ VariedadProductoComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(VariedadProductoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Debe crearse el componente', () => {
        expect(component).toBeTruthy();
    });

    
});
