import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { Vehicle } from '../_models/vehicle';

import { AuthenticationService } from '../_services/authentication.service';
import {DriverServiceService } from '../_services/driver-service.service'
@Component({
  selector: 'app-landing-page-driver',
  templateUrl: './landing-page-driver.component.html',
  styleUrls: ['./landing-page-driver.component.css']
})
export class LandingPageDriverComponent implements OnInit {
  subscriptions: Subscription[] = [];
  currentUser: User;

  driversCar: Vehicle;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private driverServiceService: DriverServiceService) { 
      this.currentUser = this.authenticationService.currentUserValue
      driverServiceService.getDriversCar(this.currentUser.id).subscribe( (result) => {        
         this.driversCar = result;
      },
      (error) => {
      });

      
  }



  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
