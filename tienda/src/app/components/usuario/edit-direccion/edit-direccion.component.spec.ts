import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDireccionComponent } from './edit-direccion.component';

describe('EditDireccionComponent', () => {
  let component: EditDireccionComponent;
  let fixture: ComponentFixture<EditDireccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDireccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDireccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
