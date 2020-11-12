import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service'

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  subscriptions: Subscription[] = [];

  loginForm;
  emailMessage: string;
  passwordMessage: string;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: '',
    });
  }

  onSubmit(loginData) {
    this.clearErrorMessages();

    if (this.validate(loginData)) {
      this.subscriptions.push(
        this.authenticationService.logIn(loginData.email, loginData.password).subscribe(
          (result) => {
            this.router.navigate(['/app']);
          },
          (error) => {
            this.loginForm.password = null;
            this.passwordMessage = error.error.message;
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

    return this.emailMessage === null && this.passwordMessage === null ;
  }

  clearErrorMessages() {
    this.emailMessage = null;
    this.passwordMessage = null;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
