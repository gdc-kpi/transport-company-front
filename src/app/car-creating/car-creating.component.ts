import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../_models/vehicle';
import { User } from '../_models/user';
import { AdminService } from '../_services/admin-service.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-car-creating',
  templateUrl: './car-creating.component.html',
  styleUrls: ['./car-creating.component.css']
})
export class CarCreatingComponent implements OnInit {
  subscriptions: Subscription[] = [];
  carForm: FormGroup;

  plateMessage: string;
  capacityMessage: string;
  loadCapacityMessage: string;
  fuelConsumptionMessage: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private adminService: AdminService) {
    this.carForm = this.formBuilder.group({
      plate: new FormControl(''),
      capacity: new FormControl(0),
      loadCapacity: new FormControl(0),
      fuelConsumption: new FormControl(0)
    });
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  onSubmit(carData) {
    this.clearErrorMessages();

    if (this.validate(carData)) {
      this.subscriptions.push(
        this.adminService.createCar(carData.plate, carData.capacity, carData.loadCapacity, carData.fuelConsumption).subscribe(
          (result) => {
              this.router.navigate(['/app/admin']);
          },
          (error) => {
            this.fuelConsumptionMessage = error.error.message;
          }
        ));
    }
  }

  validate(carData): boolean {
    if (carData.plate === '' || carData == null) {
      this.plateMessage = 'Plate cannot be empty';
    } else if (!carData.plate.match(
      '^[A-Z]{2}[0-9]{4}[A-Z]{2}')) {
      this.plateMessage = 'Incorrect plate';
    }
    if (carData.capacity === 0) {
      this.capacityMessage = 'Capacity cannot be 0';
    }
    if (carData.loadCapacity === 0) {
      this.loadCapacityMessage = 'Load capacity cannot be 0';
    }
    if (carData.fuelConsumption === 0) {
      this.fuelConsumptionMessage = 'Fuel consumption cannot be 0';
    }
    // tslint:disable-next-line:max-line-length
    return this.plateMessage === null && this.capacityMessage === null && this.loadCapacityMessage === null && this.fuelConsumptionMessage === null;
  }

  // tslint:disable-next-line:typedef
  clearErrorMessages() {
    this.plateMessage = null;
    this.capacityMessage = null;
    this.loadCapacityMessage = null;
    this.fuelConsumptionMessage = null;
  }

}
