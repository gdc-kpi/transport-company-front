import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  subscriptions: Subscription[] = [];
  passwordForm: FormGroup;


  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  oldPasswordMessage: string;
  newPasswordMessage: string;
  confirmNewPasswordMessage;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private authenticationService: AuthenticationService) {
    this.passwordForm = this.formBuilder.group({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef use-lifecycle-interface
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // tslint:disable-next-line:typedef
  onSubmit(passwordData) {
    this.clearErrorMessages();

    if (this.validate(passwordData)) {
      this.subscriptions.push(
        this.authenticationService.changeOldPassword(passwordData.oldPassword, passwordData.newPassword).subscribe(
          (result) => {
            this.router.navigate(['/login']);
          },
          (error) => {
            this.confirmNewPasswordMessage = error.error.message;
          }
        ));
    }
  }

  validate(passwordData): boolean {
    if (passwordData.oldPassword === '' || passwordData.oldPassword == null) {
      this.oldPasswordMessage = 'Password cannot be empty';
    }
    if (passwordData.newPassword === '' || passwordData.newPassword == null) {
      this.newPasswordMessage = 'Password cannot be empty';
    } else if (!passwordData.newPassword.match('.{6,}')) {
      this.newPasswordMessage = 'Password must be 6 characters long at least';
    }
    if (passwordData.confirmNewPassword === '' || passwordData.confirmNewPassword == null) {
      this.confirmNewPasswordMessage = 'Password cannot be empty';
    } else if (passwordData.confirmNewPassword !== passwordData.newPassword) {
      this.confirmNewPasswordMessage = 'Passwords don\'t match';
    }
    return this.oldPasswordMessage === null && this.newPasswordMessage === null && this.confirmNewPasswordMessage === null;
  }

  clearErrorMessages(): any {
    this.oldPasswordMessage = null;
    this.newPasswordMessage = null;
    this.confirmNewPasswordMessage = null;
  }

}
