import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
// import { Vehicle } from '../_models/vehicle';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { OrderServiceService } from '../_services/order-service.service';
import { DriverServiceService } from '../_services/driver-service.service';
import { Order2 } from '../_models/order2';
import { Driver } from '../_models/driver';
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
  currentOrder: Order2;
  orderForm: FormGroup;
  carplates: Driver[] = [];
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
  lat = 50.45;
  lng = 30.42;

  isDriver: boolean;
  isDisabled = false;
  orderId: string;
  private routeSub: Subscription;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private orderService: OrderServiceService,
    private driverService: DriverServiceService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute) {
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
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.orderId = params.id;
      this.orderService.getOrder(this.orderId).subscribe((result) => {
        this.currentOrder = result;
      });
      /*
      this.subscriptions.push(
        this.orderService.getPath(this.orderId).subscribe(res => console.log(res))
      );*/
      // console.log(params) //log the entire params object
      // console.log(params['id']) //log the value of id
    });
    if (this.currentUser == null) {
      this.router.navigate(['/']);
    } else { this.isDriver = this.currentUser.role !== 'admin'; }
    // mapboxgl.accessToken = environment.mapbox.accessToken;
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken')
      .set('pk.eyJ1IjoiZGV1bWF1ZGl0IiwiYSI6ImNraW0xM3QzbzBwM2QycnFqb2huOW00MXYifQ.MWp2RY5TyYnu-HmT4Co79w');
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 10,
      center: [this.lng, this.lat]
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('load', () => {
      this.orderService.getPath(this.orderId).subscribe(res => {
        const minMax = res.reduce((acc, cur) => [
          [Math.min(acc[0][0], cur["longitude"]), Math.min(acc[0][1], cur["latitude"])], 
          [Math.max(acc[1][0], cur["longitude"]), Math.max(acc[1][1], cur["latitude"])]
        ], [[180, 180], [-180, -180]]);
        const center = [(minMax[0][0] + minMax[1][0])/2, (minMax[0][1] + minMax[1][1])/2];
        this.map.setCenter([center[0], center[1]]);
        this.map.setZoom(Math.log2(180/(minMax[1][0] - minMax[0][0])));
        this.map.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': res.map(elem => [elem["longitude"], elem["latitude"]])
            }
          }
        });
        this.map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#FF0000',
            'line-width': 5
          }
        });
      })
    });
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
    if (this.currentUser.role === 'admin') {
      this.orderService.getDriversList2(this.currentOrder).subscribe( (result: Driver[]) => {

        result.forEach(val => this.carplates.push(Object.assign({}, val)));
        for(let index in this.carplates) {        
          this.select.options[this.select.options.length] = new Option(this.carplates[index].carPlate.toString(), this.carplates[index].carPlate.toString());
        }
        this.updateDriverName();
      },
      (error) => {
        this.drivernameMessage = 'Server error: ' + error.error.message;
      }); 
    }
  }

  updateDriverName(): any {
    if (this.carplates[this.select.selectedIndex].fullname) {
      this.orderForm.patchValue({drivername: this.carplates[this.select.selectedIndex].fullname.toString()});
    }
    else {
      this.orderForm.patchValue({drivername: ''});
    }
  }

  /*fromClick(event: google.maps.MouseEvent): void {
    this.orderForm.patchValue({ from: event.latLng.toString() });
    const fromDialog = document.getElementById('fromMapDialog') as HTMLDialogElement;
    fromDialog.close();
  }

  toClick(event: google.maps.MouseEvent): void {
    this.orderForm.patchValue({ to: event.latLng.toString() });
    const toDialog = document.getElementById('toMapDialog') as HTMLDialogElement;
    toDialog.close();
  }*/

  reload(): void {/*
    this.subscriptions.push(
      this.orderService.getPath(this.orderId).subscribe(res => console.log(res))
    );*/
    this.orderService.getOrder(this.orderId).subscribe((result) => {
      this.currentOrder = result;
    });
  }

  async changeOrderStatus(status: string): Promise<void> {
    this.isDisabled = true;
    this.subscriptions.push(this.driverService.changeOrderStatus(this.orderId, status).subscribe());
    await this.delay(2000);
    if (status === 'REJECTED') {
      this.router.navigate(['/app/driver']);
    }
    this.reload();
    this.isDisabled = false;
  }

  delay(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
