import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from '../_services/admin-service.service';

@Component({
  selector: 'app-invite-admin',
  templateUrl: './invite-admin.component.html',
  styleUrls: ['./invite-admin.component.css']
})
export class InviteAdminComponent implements OnInit {
  subscriptions: Subscription[] = [];
  title = 'Invite admin'
  invited: boolean = false
  inviteForm: FormGroup;
  emailMessage: string;
  passwordMessage: string;

  constructor(private formBuilder: FormBuilder,   
    private router: Router,
    private adminService: AdminService,) { 
      this.invited = false;

    this.inviteForm = this.formBuilder.group({
      email: '',
      fullname: ''
    });
  
  }

  ngOnInit(): void {

    this.title = 'Invite admin'

  }


  onSubmit(orderData) {
    this.clearErrorMessages();  

    if (this.validate(orderData)) {
      this.subscriptions.push(
        this.adminService.inviteAdmin(orderData.fullname, orderData.email).subscribe(
          (result) => {
                this.title = 'Admin invited successfully'
                this.invited = true;
             },
            (error) => {
              this.passwordMessage = error.error.message
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
    if (signUpData.fullname === '' || signUpData.fullname == null) {
      this.passwordMessage = 'Full name cannot be empty';
    } else if (!signUpData.fullname.match("^([A-ZÀ-ÿА-ЩЬЮЯҐЄІЇ][-,a-z.а-щьюяґєії']+[ ]*)+$")) {
      this.passwordMessage = 'Incorrect full name';
    }
    return this.passwordMessage === null && this.emailMessage === null;
  }

  clearErrorMessages() {
    this.emailMessage = null;
    this.passwordMessage = null;
  }

}
