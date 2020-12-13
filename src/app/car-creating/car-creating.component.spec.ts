import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarCreatingComponent } from './car-creating.component';

describe('CarCreatingComponent', () => {
  let component: CarCreatingComponent;
  let fixture: ComponentFixture<CarCreatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarCreatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarCreatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
