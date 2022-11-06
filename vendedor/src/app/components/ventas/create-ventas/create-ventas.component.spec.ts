import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVentasComponent } from './create-ventas.component';

describe('CreateVentasComponent', () => {
  let component: CreateVentasComponent;
  let fixture: ComponentFixture<CreateVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
