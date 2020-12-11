import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from '../_services/admin-service.service'
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { Order } from '../_models/order';

@Component({
  selector: 'app-landing-page-admin',
  templateUrl: './landing-page-admin.component.html',
  styleUrls: ['./landing-page-admin.component.css']
})
export class LandingPageAdminComponent implements OnInit {
  subscriptions: Subscription[] = [];
  currentUser: User;

  confirmedArray: Order[];
  confirmPendingArray: Order[];
  finishedArray: Order[];
  rejectedArray: Order[];


  constructor(
    private router: Router,
    private adminService: AdminService,
    private authenticationService: AuthenticationService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.currentUser == null ||
      this.currentUser.role !== 'admin') {
      this.router.navigate(['/']);
    }

    this.getConfirmed()
    this.getFinished()
    this.getRejected()
    this.getConfirmationPending()

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  getRejected() {
    this.subscriptions.push(
      this.adminService.getOrders("rejected", this.currentUser.id.toString()).subscribe(
        (result) => {
          this.rejectedArray = result;
        },

      ));
  }


  getConfirmationPending() {
    this.subscriptions.push(
      this.adminService.getOrders("confirmation-pending", this.currentUser.id.toString()).subscribe(
        (result) => {
          this.confirmPendingArray = result;
        },

      ));
  }


  getConfirmed() {
    this.subscriptions.push(
      this.adminService.getOrders("confirmed", this.currentUser.id.toString()).subscribe(
        (result) => {
          this.confirmedArray = result;
        },

      ));
  }


  getFinished() {
    this.subscriptions.push(
      this.adminService.getOrders("finished", this.currentUser.id.toString()).subscribe(
        (result) => {
          this.finishedArray = result;
        },

      ));
  }

  reload($event) {
    switch ($event.index) {
      case 0:
        this.getRejected()
        break;
      case 1:
        this.getConfirmationPending()
        break;
      case 2:
        this.getConfirmed()
        break;
      case 3:
        this.getFinished()

    }
  }
}
