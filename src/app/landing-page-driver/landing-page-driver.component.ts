import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { Vehicle } from '../_models/vehicle';
import { Order2 } from '../_models/order2';

import { AuthenticationService } from '../_services/authentication.service';
import { DriverServiceService } from '../_services/driver-service.service';
@Component({
  selector: 'app-landing-page-driver',
  templateUrl: './landing-page-driver.component.html',
  styleUrls: ['./landing-page-driver.component.css']
})

export class LandingPageDriverComponent implements OnInit {
  subscriptions: Subscription[] = [];
  currentUser: User;

  carplateForm;
  cars = [];
  carplates: Vehicle[] = [];
  select: HTMLSelectElement;

  driversCar: Vehicle;

  upcomingArray: Order2[];
  confirmPendingArray: Order2[];
  finishedArray: Order2[];

  isDisabled = false;

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

  onCarplateSubmit(carData): void {
    this.subscriptions.push(
      this.driverService.chooseDriversCar(this.currentUser.id, carData.cars).subscribe(
        () => {
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

  loadCarplates(): void {
    this.carplateForm = this.formBuilder.group({
      cars: [''],
    });

    this.driverService.getFreeCars().subscribe( (result: Vehicle[]) => {
      result.forEach(val => this.carplates.push(Object.assign({}, val)));
      for (const index in this.carplates) {
        if (this.carplates.hasOwnProperty(index)) {
          // this.select.options[this.select.options.length] = new
          // Option(this.carplates[index].plate.toString(), this.carplates[index].plate.toString());
          this.cars.push(this.carplates[index].plate.toString());
        }
      }
    },
    (error) => {
    });
  }

  reload(index: number): void {
    switch (index) {
      case 0:
        this.getToConfirm();
        break;
      case 1:
        this.getUpcoming();
        break;
      case 2:
        this.getFinished();
        break;
    }
  }

  getFinished(): void {
    this.subscriptions.push(
      this.driverService.getOrders('finished', this.currentUser.id.toString()).subscribe(
        (result) => {
          this.finishedArray = result;
        },
      ));
  }

  getToConfirm(): void {
    this.subscriptions.push(
      this.driverService.getOrders('to-confirm', this.currentUser.id.toString()).subscribe(
        (result) => {
          this.confirmPendingArray = result;
        },
      ));
  }

  getUpcoming(): void {
    this.subscriptions.push(
      this.driverService.getOrders('upcoming', this.currentUser.id.toString()).subscribe(
        (result) => {
          this.upcomingArray = result;
        },
      ));
  }

  async changeOrderStatus(order, status: string): Promise<void> {
    this.isDisabled = true;
    this.driverService.changeOrderStatus(order.orderId, status).subscribe();
    await this.delay(2000);
    this.reload(0);
    this.isDisabled = false;
  }

  delay(ms: number): any {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
