import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexClienteComponent } from './index-cliente.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('IndexClienteComponent', () => {
    let component: IndexClienteComponent;
    let fixture: ComponentFixture<IndexClienteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule,
                RouterTestingModule
            ],
            declarations: [ IndexClienteComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(IndexClienteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Debe crearse el componente', () => {
        expect(component).toBeTruthy();
    });

    
});
