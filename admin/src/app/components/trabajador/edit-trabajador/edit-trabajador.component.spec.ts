import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrabajadorComponent } from './edit-trabajador.component';

describe('EditTrabajadorComponent', () => {
  let component: EditTrabajadorComponent;
  let fixture: ComponentFixture<EditTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTrabajadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
