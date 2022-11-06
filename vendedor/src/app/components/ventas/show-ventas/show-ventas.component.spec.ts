import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVentasComponent } from './show-ventas.component';

describe('ShowVentasComponent', () => {
  let component: ShowVentasComponent;
  let fixture: ComponentFixture<ShowVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowVentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
