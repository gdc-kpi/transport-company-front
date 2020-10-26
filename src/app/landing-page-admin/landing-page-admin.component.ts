import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-landing-page-admin',
  templateUrl: './landing-page-admin.component.html',
  styleUrls: ['./landing-page-admin.component.css']
})
export class LandingPageAdminComponent implements OnInit {
  subscriptions: Subscription[] = [];
  currentUser: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { 
      this.currentUser = this.authenticationService.currentUserValue
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
