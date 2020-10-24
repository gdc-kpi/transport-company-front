import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.css']
})
export class RestorePasswordComponent implements OnInit {
  subscriptions: Subscription[] = [];
  emailForm;
  emailMessage: string = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.emailForm = this.formBuilder.group({
      email: '',
    });
  }

  ngOnInit(): void {

  }

  onSubmit(emailData) {
    this.emailMessage = null;
    if (this.validate(emailData)) {
      this.subscriptions.push(
        this.authenticationService.requestPasswordReset(emailData.email).pipe().subscribe(
          (result) => {
            alert("Check your email!");
          },
          (error) => {
            this.emailMessage = error.error.message;
          }
        ));
    }
  }



  validate(emailData): boolean {
    if (emailData.email === '' || emailData.email == null) {
      this.emailMessage = 'Email cannot be empty';
    } else if (!emailData.email.match(
      '^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$')) {
      this.emailMessage = 'Incorrect email';
    }
    return this.emailMessage === null;
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
