import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import {Subscription} from 'rxjs';
import { Vehicle } from '../_models/vehicle';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { OrderServiceService } from '../_services/order-service.service';
import { DriverServiceService } from '../_services/driver-service.service';
import {Order} from '../_models/order';
import * as mapboxgl from 'mapbox-gl';

const environment = {
  mapbox: {
    accessToken: 'pk.eyJ1IjoiZGV1bWF1ZGl0IiwiYSI6ImNraW0xM3QzbzBwM2QycnFqb2huOW00MXYifQ.MWp2RY5TyYnu-HmT4Co79w'
  }
};

@Component({
  selector: 'app-order',
  templateUrl: './show-order.component.html',
  styleUrls: ['./show-order.component.css']
})

export class ShowOrderComponent implements OnInit {
  subscriptions: Subscription[] = [];
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;

  currentUser: User;
  currentOrder: Order;
  orderForm: FormGroup;
  carplates: Vehicle[] = [];
  select: HTMLSelectElement;

  titleMessage: string;
  descriptionMessage: string;
  weightMessage: string;
  volumeMessage: string;
  toMessage: string;
  fromMessage: string;
  carplateMessage: string;
  deadlineMessage: string;
  drivernameMessage: string;

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;

  isDriver: boolean;
  isDisabled = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private orderService: OrderServiceService,
              private driverService: DriverServiceService,
              private authenticationService: AuthenticationService) {
    this.orderForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      weight: new FormControl(0),
      volume: new FormControl(0),
      from: new FormControl(),
      to: new FormControl(),
      carplate: new FormControl(''),
      deadline: new FormControl(),
      drivername: new FormControl('')
    });
    this.currentUser = authenticationService.currentUserValue;
    this.subscriptions.push(
      this.orderService.getOrder(this.router.url.substring(12)).subscribe(
        (result) => {
          this.currentOrder = result;
        },
      ));
  }

  ngOnInit(): void {
    if (this.currentUser == null) {
      this.router.navigate(['/']);
    } else if (this.currentUser.role === 'admin') {
      this.isDriver = false;
    } else{
      this.isDriver = true;
    }
    // mapboxgl.accessToken = environment.mapbox.accessToken;
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken')
      .set('pk.eyJ1IjoiZGV1bWF1ZGl0IiwiYSI6ImNraW0xM3QzbzBwM2QycnFqb2huOW00MXYifQ.MWp2RY5TyYnu-HmT4Co79w');
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.select = document.getElementById('carplate-select') as HTMLSelectElement;
    this.loadCarplates();
  }

  onSubmit(orderData): any {
    this.clearErrorMessages();

    // if (this.validate(orderData)) {
    //   this.subscriptions.push(
    //     // this.orderService.createOrder(orderData.title, orderData.description).subscribe(
    //     //   (result) => {
    //     //       this.router.navigate(['/app/admin']);
    //     //   },
    //     //   (error) => {
    //     //     this.titleMessage = error.error.message;
    //     //   }
    //     // ));
    // }
  }

  validate(orderData): boolean {
    if (orderData.title === '' || orderData.title == null) {
      this.titleMessage = 'Title cannot be empty';
    } /* else if (!orderData.title.match(
      '^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$')) {
      this.titleMessage = 'Incorrect title';
    } */

    if (orderData.description === '' || orderData.description == null) {
      this.descriptionMessage = 'Description cannot be empty';
    }/* else if (!orderData.password.match('.{6,}')) {
      this.descriptionMessage = 'Description must be 6 characters long at least';
    } */

    return this.titleMessage === null && this.descriptionMessage === null;
  }

  clearErrorMessages(): any {
    this.titleMessage = null;
    this.descriptionMessage = null;
    this.weightMessage = null;
    this.volumeMessage = null;
    this.toMessage = null;
    this.fromMessage = null;
    this.carplateMessage = null;
    this.deadlineMessage = null;
    this.drivernameMessage = null;
  }


  loadCarplates(): any {
    this.orderService.getDriversList().subscribe((result: Vehicle[]) => {

      result.forEach(val => this.carplates.push(Object.assign({}, val)));
      for (const index in this.carplates) {
        if (this.carplates.hasOwnProperty(index)) {
          this.select.options[this.select.options.length] = new Option(this.carplates[index].plate.toString(),
            this.carplates[index].plate.toString());
        }
      }
      this.updateDriverName();
    },
      (error) => {
      });
  }

  updateDriverName(): any {
    if (this.carplates[this.select.selectedIndex].userId) {
      this.orderForm.patchValue({ drivername: this.carplates[this.select.selectedIndex].userId.toString() });
    }
    else {
      this.orderForm.patchValue({ drivername: '' });
    }
  }

  fromClick(event: google.maps.MouseEvent): void {
    this.orderForm.patchValue({ from: event.latLng.toString() });
    const fromDialog = document.getElementById('fromMapDialog') as HTMLDialogElement;
    fromDialog.close();
  }

  toClick(event: google.maps.MouseEvent): void {
    this.orderForm.patchValue({ to: event.latLng.toString() });
    const toDialog = document.getElementById('toMapDialog') as HTMLDialogElement;
    toDialog.close();
  }

  reload(): void {
    this.subscriptions.push(
      this.orderService.getOrder(this.router.url.substring(12)).subscribe(
        (result) => {
          this.currentOrder = result;
        },
      ));
  }

  async changeOrderStatus(status: string): Promise<void> {
    this.isDisabled = true;
    this.subscriptions.push(this.driverService.changeOrderStatus(this.currentOrder.orderId, status).subscribe());
    await this.delay(2000);
    this.reload();
    this.isDisabled = false;
  }

  delay(ms: number): any {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
