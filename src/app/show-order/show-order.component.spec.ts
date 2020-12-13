import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOrderComponent } from './show-order.component';

describe('OrderComponent', () => {
  let component: ShowOrderComponent;
  let fixture: ComponentFixture<ShowOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
