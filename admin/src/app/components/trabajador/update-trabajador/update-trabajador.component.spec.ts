import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTrabajadorComponent } from './update-trabajador.component';

describe('UpdateTrabajadorComponent', () => {
  let component: UpdateTrabajadorComponent;
  let fixture: ComponentFixture<UpdateTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTrabajadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
