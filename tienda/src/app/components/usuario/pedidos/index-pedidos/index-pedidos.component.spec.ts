import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexPedidosComponent } from './index-pedidos.component';

describe('IndexPedidosComponent', () => {
  let component: IndexPedidosComponent;
  let fixture: ComponentFixture<IndexPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexPedidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
