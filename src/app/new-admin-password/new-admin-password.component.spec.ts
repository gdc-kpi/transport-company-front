import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAdminPasswordComponent } from './new-admin-password.component';

describe('NewAdminPasswordComponent', () => {
  let component: NewAdminPasswordComponent;
  let fixture: ComponentFixture<NewAdminPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAdminPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAdminPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
