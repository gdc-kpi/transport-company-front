import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-landing-page-driver',
  templateUrl: './landing-page-driver.component.html',
  styleUrls: ['./landing-page-driver.component.css']
})
export class LandingPageDriverComponent implements OnInit {
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
