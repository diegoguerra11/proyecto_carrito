import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCuponComponent } from './update-cupon.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('UpdateCuponComponent', () => {
    let component: UpdateCuponComponent;
    let fixture: ComponentFixture<UpdateCuponComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule,
                RouterTestingModule
            ],
            declarations: [ UpdateCuponComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(UpdateCuponComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Debe crearse el componente', () => {
        expect(component).toBeTruthy();
    });

    
});
