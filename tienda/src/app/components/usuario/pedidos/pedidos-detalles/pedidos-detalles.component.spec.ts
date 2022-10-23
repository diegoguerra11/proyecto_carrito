import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDetallesComponent } from './pedidos-detalles.component';

describe('PedidosDetallesComponent', () => {
  let component: PedidosDetallesComponent;
  let fixture: ComponentFixture<PedidosDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosDetallesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
