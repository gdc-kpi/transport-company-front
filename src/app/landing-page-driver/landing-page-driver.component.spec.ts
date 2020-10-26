import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageDriverComponent } from './landing-page-driver.component';

describe('LandingPageDriverComponent', () => {
  let component: LandingPageDriverComponent;
  let fixture: ComponentFixture<LandingPageDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPageDriverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
