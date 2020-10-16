import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service'
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  subscriptions: Subscription[] = [];
  signUpForm;

  fullNameMessage: string;
  emailMessage: string;
  passwordMessage: string;
  confirmPasswordMessage: string;

  constructor(
    private router: Router,
    private formBuilder : FormBuilder,
    private authenticationService: AuthenticationService
   ) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      email: '',
      fullName: '',
      password: '',
      confirmPassword: ''
    });
  }

  onSubmit(signUpData) {
    this.clearErrorMessages();

   if (this.validate(signUpData)) {
      this.subscriptions.push(
        this.authenticationService.signUp(signUpData.email, signUpData.fullName, signUpData.password).subscribe(
          (result) => {
            alert('Check your email!');
          },
          (error) => {
            alert(error.error.message);
          }
        ));
    }
  }

  validate(signUpData): boolean {
    if (signUpData.email === '' || signUpData.email == null) {
      this.emailMessage = 'Email cannot be empty';
    } else if (!signUpData.email.match(
      '^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$')) {
      this.emailMessage = 'Incorrect email';
    }

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

    if (signUpData.fullName === '' || signUpData.fullName == null) {
      this.fullNameMessage = 'Full name cannot be empty';
    } else if (!signUpData.fullName.match('([^0-9]+$)')) {
      this.fullNameMessage = 'Full name mustn\'t contain numbers';
    }

    return this.emailMessage === null &&  this.fullNameMessage === null && this.passwordMessage === null && this.confirmPasswordMessage === null;
  }

  clearErrorMessages() {
    this.confirmPasswordMessage = null;
    this.emailMessage = null;
    this.passwordMessage = null;
    this.fullNameMessage = null;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
