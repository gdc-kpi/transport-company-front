import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { Vehicle } from '../_models/vehicle';

import { AuthenticationService } from '../_services/authentication.service';
import { DriverServiceService } from '../_services/driver-service.service'
@Component({
  selector: 'app-landing-page-driver',
  templateUrl: './landing-page-driver.component.html',
  styleUrls: ['./landing-page-driver.component.css']
})
export class LandingPageDriverComponent implements OnInit {
  subscriptions: Subscription[] = [];
  currentUser: User;

  carplateForm;
  carplates: Vehicle[]=[];
  select: HTMLSelectElement;

  driversCar: Vehicle;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private driverService: DriverServiceService) { 
      this.currentUser = this.authenticationService.currentUserValue;
      driverService.getDriversCar(this.currentUser.id).subscribe( (result) => {        
         this.driversCar = result;
      },
      (error) => {
      });

      this.carplateForm = this.formBuilder.group({
        carplate: new FormControl(''),
      }); 
  }

  onCarplateSubmit(carplateData) {
    
  }

  ngOnInit(): void {
    this.select = document.getElementById("carplate-select") as HTMLSelectElement; 
    this.loadCarplates();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadCarplates() {
    this.driverService.getFreeCars().subscribe( (result: Vehicle[]) => {

      result.forEach(val => this.carplates.push(Object.assign({}, val)));
      for(let index in this.carplates) {        
        this.select.options[this.select.options.length] = new Option(this.carplates[index].plate.toString(), this.carplates[index].plate.toString());
      }
    },
    (error) => {
    });  
  }

}
