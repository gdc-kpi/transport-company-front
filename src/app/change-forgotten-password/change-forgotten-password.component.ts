import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-change-forgotten-password',
  templateUrl: './change-forgotten-password.component.html',
  styleUrls: ['./change-forgotten-password.component.css']
})
export class ChangeForgottenPasswordComponent implements OnInit {
  subscriptions: Subscription[] = [];

  private key;
  passwordForm;
  confirmPasswordMessage;
  passwordMessage
  passwordChanged : boolean

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService) {
    this.passwordForm = this.formBuilder.group({
      email: '',
      fullName: '',
      password: '',
      confirmPassword: ''
    });
  }

  ngOnInit(): void {
    this.key = this.route.snapshot.queryParams['key'];
    this.route.paramMap.subscribe(params => {
      this.subscriptions.push(
        this.authenticationService.confirmPasswordReset(this.key).subscribe(
          (result) => {

          },
          (error) => {
            this.router.navigate(['/login']);
          }));

    })

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onSubmit(signUpData) {

    this.confirmPasswordMessage = null;
    this.passwordMessage = null;

    if (this.validate(signUpData)) {
      this.subscriptions.push(
        this.authenticationService.changePassword(this.key, signUpData.password).subscribe(
          (result) => {
            this.passwordChanged = true;
          },
          (error) => {
            this.confirmPasswordMessage = error.error.message;
          }
        ));
    }
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


}
