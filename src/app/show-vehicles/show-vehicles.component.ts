import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { Vehicle } from '../_models/vehicle';
import { AuthenticationService } from '../_services/authentication.service';
import {Location} from '@angular/common';
import { AdminService } from '../_services/admin-service.service';

@Component({
  selector: 'app-show-vehicles',
  templateUrl: './show-vehicles.component.html',
  styleUrls: ['./show-vehicles.component.css']
})
export class ShowVehiclesComponent implements OnInit {

  subscriptions: Subscription[] = [];
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

  currentUser: User;
  vehicles: Map<String, Vehicle>;

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
    // this.select = document.getElementById("carplate-select") as HTMLSelectElement; 
    // this.loadCarplates(this.orderForm.value);

    this.getVehicles()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  backClicked() {
    this.location.back();
  }

  getVehicles(): any {
    this.subscriptions.push(
      this.adminService.getAllCars().subscribe(
        (result) => {
          this.vehicles = result;
          console.log(result);
        },
      ));
  }
}
