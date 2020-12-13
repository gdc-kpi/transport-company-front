import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-new-admin-password',
  templateUrl: './new-admin-password.component.html',
  styleUrls: ['./new-admin-password.component.css']
})
export class NewAdminPasswordComponent implements OnInit {
  subscriptions: Subscription[] = [];
  signUpForm;

  passwordMessage: string;
  confirmPasswordMessage: string;
  title : string = 'Set password and Activate your account'
  constructor( private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      email: '',
      fullName: '',
      password: '',
      confirmPassword: ''
    });
    

  }


  validate(signUpData): boolean {
    if (signUpData.password === '' || signUpData.password == null) {
      this.passwordMessage = 'Password cannot be empty';
    } else if (!signUpData.password.match('.{6,}')) {
      this.passwordMessage = 'Password must be 6 characters long at least';

    }

    if (signUpData.confirmPassword === '' || signUpData.confirmPassword == null) {
      this.confirmPasswordMessage = 'Password cannot be empty';
    } else if (signUpData.confirmPassword !== signUpData.password) {
      this.confirmPasswordMessage = 'Passwords don\'t match';
    }


    return this.passwordMessage === null && this.confirmPasswordMessage === null;
  }

  private clearErrorMessages() {
    this.confirmPasswordMessage = null;
    this.passwordMessage = null;
  }


  onSubmit(signUpData) {
    this.clearErrorMessages();

    if (this.validate(signUpData)) {
      this.subscriptions.push(
        this.authenticationService.adminActivate(this.route.snapshot.queryParams['key'],signUpData.password).subscribe(
          (result) => {
            this.title = 'Activation successful, you may log in now'
          },
          (error) => {
            this.confirmPasswordMessage = error.error.message;
          }
        ));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
