import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingAuthUserComponent } from './landing-auth-user.component';

describe('LandingAuthUserComponent', () => {
  let component: LandingAuthUserComponent;
  let fixture: ComponentFixture<LandingAuthUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingAuthUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingAuthUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
