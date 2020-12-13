import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { Driver } from '../_models/driver';
import { AuthenticationService } from '../_services/authentication.service';
import { DriverServiceService } from '../_services/driver-service.service';
import {Location} from '@angular/common';
import { AdminService } from '../_services/admin-service.service';

@Component({
  selector: 'app-show-drivers',
  templateUrl: './show-drivers.component.html',
  styleUrls: ['./show-drivers.component.css']
})
export class ShowDriversComponent implements OnInit {

  subscriptions: Subscription[] = [];
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

  currentUser: User;
  drivers: Driver[] = [];

  constructor(private router: Router,
              private adminService: AdminService,
              private authenticationService: AuthenticationService,
              private location: Location) {
        this.currentUser = authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.currentUser == null ||
      this.currentUser.role !== 'admin') {
      this.router.navigate(['/']);
  }

    this.getDrivers();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  
  backClicked() {
    this.location.back();
  }

  getDrivers(): any {
    this.subscriptions.push(
      this.adminService.getDrivers("").subscribe(
        (result) => {
          this.drivers = result;
          console.log(result);
        },
      ));
  }
}
