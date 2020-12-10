import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { Vehicle } from '../_models/vehicle';
import { Order } from '../_models/order';

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
  cars=[];
  carplates: Vehicle[]=[];
  select: HTMLSelectElement;

  driversCar: Vehicle;

  upcomingArray: Order[];
  confirmPendingArray: Order[];
  finishedArray: Order[];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private driverService: DriverServiceService) { 
      this.loadCarplates();
      this.currentUser = this.authenticationService.currentUserValue;
      driverService.getDriversCar(this.currentUser.id).subscribe( (result) => {        
         this.driversCar = result;
      },
      (error) => {
      });

      
      this.getToConfirm();
      this.getUpcoming();
      this.getFinished();

  }

  onCarplateSubmit(carData) {
    this.subscriptions.push(
      this.driverService.chooseDriversCar(this.currentUser.id, carData.cars).subscribe(
        (result) => {
          this.driverService.getDriversCar(this.currentUser.id).subscribe( (result) => {        
            this.driversCar = result;
          },
          (error) => {
          });
        },
        (error) => {
          this.carplateForm.cars = null;
        }
      ));
  }

  ngOnInit(): void {
    if (this.currentUser == null ||
      this.currentUser.role !== 'driver') {
      this.router.navigate(['/']);
    }
    // this.select = document.getElementById("carplate-select") as HTMLSelectElement; 
    // this.loadCarplates();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadCarplates() {
    this.carplateForm = this.formBuilder.group({
      cars: [''],
    }); 

    this.driverService.getFreeCars().subscribe( (result: Vehicle[]) => {
      result.forEach(val => this.carplates.push(Object.assign({}, val)));
      for(let index in this.carplates) {
        // this.select.options[this.select.options.length] = new Option(this.carplates[index].plate.toString(), this.carplates[index].plate.toString());
        this.cars.push(this.carplates[index].plate.toString());
      }
    },
    (error) => {
    });  
  }



  reload($event) {
    switch ($event.index) {
      case 0:
        this.getToConfirm()
        break;
      case 1:
        this.getUpcoming()
        break;
      case 2:
        this.getFinished()
        break;

    }
  }


  getFinished() {
    this.subscriptions.push(
      this.driverService.getOrders("finished", this.currentUser.id.toString()).subscribe(
        (result) => {
          this.finishedArray = result;
        },

      ));
  }


  getToConfirm() {
    this.subscriptions.push(
      this.driverService.getOrders("to-confirm", this.currentUser.id.toString()).subscribe(
        (result) => {
          this.confirmPendingArray = result;
        },

      ));
  }


  getUpcoming() {
    this.subscriptions.push(
      this.driverService.getOrders("upcoming", this.currentUser.id.toString()).subscribe(
        (result) => {
          this.upcomingArray = result;
        },

      ));
  }

}
