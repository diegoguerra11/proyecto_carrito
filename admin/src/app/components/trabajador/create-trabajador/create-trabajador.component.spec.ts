import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrabajadorComponent } from './create-trabajador.component';

describe('CreateTrabajadorComponent', () => {
  let component: CreateTrabajadorComponent;
  let fixture: ComponentFixture<CreateTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTrabajadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
