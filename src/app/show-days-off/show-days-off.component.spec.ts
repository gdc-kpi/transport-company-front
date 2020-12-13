import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDaysOffComponent } from './show-days-off.component';

describe('ShowDaysOffComponent', () => {
  let component: ShowDaysOffComponent;
  let fixture: ComponentFixture<ShowDaysOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowDaysOffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDaysOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
