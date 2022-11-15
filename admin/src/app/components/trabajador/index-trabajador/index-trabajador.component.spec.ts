import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexTrabajadorComponent } from './index-trabajador.component';

describe('IndexTrabajadorComponent', () => {
  let component: IndexTrabajadorComponent;
  let fixture: ComponentFixture<IndexTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexTrabajadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
