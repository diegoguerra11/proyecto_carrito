import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVentasComponent } from './show-ventas.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
declare let $:any;

describe('ShowVentasComponent', () => {
    let component: ShowVentasComponent;
    let fixture: ComponentFixture<ShowVentasComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule,
                RouterTestingModule
            ],
            declarations: [ ShowVentasComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ShowVentasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Debe crearse el componente', () => {
        expect(component).toBeTruthy();
    });

    
});
