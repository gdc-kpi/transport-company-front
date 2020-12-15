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
import { Order } from '../_models/order';
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
  status: string;
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
        this.status = this.currentOrder.status;
        this.loadCarplates();
      });
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
  }

  onSubmit(orderData) {
    this.clearErrorMessages();
    if (this.validate(orderData)) {
      this.subscriptions.push(
        this.orderService.assignDriver(this.currentOrder.orderId, this.carplates[this.select.selectedIndex].carPlate.toString()).subscribe(
          (result) => {
              this.reload();
          },
          (error) => {
            console.log(error);
            this.drivernameMessage = 'Server error: ' + error.error.message;
          }
        )
        );
    }
  }

  validate(orderData): boolean {
    if (this.carplates[this.select.selectedIndex].carPlate === '' || this.carplates[this.select.selectedIndex].carPlate == null) {
      this.carplateMessage = 'Carplate cannot be empty';
    }

    return this.carplateMessage === null;
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

  loadCarplates() {

    if (this.currentUser.role === 'admin') {
      let order = new Order();
      order.source = {longitude: '', latitude: ''};
      order.destination = {longitude: '', latitude: ''};
      order.volume = this.currentOrder.volume.toString();
      order.weight = this.currentOrder.weight.toString();
      order.car_id = '';
      order.description ='';
      order.deadline = this.currentOrder.deadline.replace('T', ' ') + '.0';
      order.admins_id = this.currentUser.id;
      order.title  = '';

      this.orderService.getDriversList(order).subscribe( (result: Driver[]) => {

        result.forEach(val => this.carplates.push(Object.assign({}, val)));
        this.select = document.getElementById('carplate-select') as HTMLSelectElement;
        for(let index in this.carplates) {        
          this.select.options[this.select.options.length] = new Option(this.carplates[index].carPlate.toString(), this.carplates[index].carPlate.toString());
        }
        this.updateDriverName();
      },
      (error) => {
        console.log(JSON.stringify(error));
        this.drivernameMessage = 'Server error: ' + error.error.message;
      }); 
    }
  }

  updateDriverName() {
    if (this.select.selectedIndex < 0) {
      return;
    }
    if (this.carplates[this.select.selectedIndex].fullname) {
      this.orderForm.patchValue({drivername: this.carplates[this.select.selectedIndex].fullname.toString()});
    }
    else {
      this.orderForm.patchValue({drivername: ''});
    }
  }


  reload() {
    this.orderService.getOrder(this.orderId).subscribe((result) => {
        this.currentOrder = result;
        this.status = this.currentOrder.status;
        this.loadCarplates();
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
