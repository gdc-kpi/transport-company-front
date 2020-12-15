import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { OrderServiceService } from '../_services/order-service.service';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { Order } from '../_models/order';
import { Driver } from '../_models/driver';
import * as mapboxgl from 'mapbox-gl';
import { stringify } from '@angular/compiler/src/util';

const environment = {
  mapbox: {
    accessToken: 'pk.eyJ1IjoiZGV1bWF1ZGl0IiwiYSI6ImNraW0xM3QzbzBwM2QycnFqb2huOW00MXYifQ.MWp2RY5TyYnu-HmT4Co79w'
  }
};

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  subscriptions: Subscription[] = [];
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

  currentUser: User;
  orderForm: FormGroup;
  carplates: Driver[]=[];
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

  mapFrom: mapboxgl.Map;
  mapTo: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lng = 30.5;
  lat = 50.5;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private orderService: OrderServiceService,
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
  }

  ngOnInit(): void {
    if (this.currentUser == null ||
      this.currentUser.role !== 'admin') {
      this.router.navigate(['/']);
  }

  Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken')
      .set('pk.eyJ1IjoiZGV1bWF1ZGl0IiwiYSI6ImNraW0xM3QzbzBwM2QycnFqb2huOW00MXYifQ.MWp2RY5TyYnu-HmT4Co79w');
    this.mapFrom = new mapboxgl.Map({
      container: 'mapFrom',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });
    this.mapTo = new mapboxgl.Map({
      container: 'mapTo',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });
    this.mapFrom.addControl(new mapboxgl.NavigationControl());
    this.mapTo.addControl(new mapboxgl.NavigationControl());

    this.mapFrom.on('click',  (e) => {
      this.orderForm.patchValue({from: e.lngLat.toString().split('t')[1]});
      let fromDialog = document.getElementById("fromMapDialog") as HTMLDialogElement;
      fromDialog.close();
    });
    this.mapTo.on('click',  (e) => {
      this.orderForm.patchValue({to: e.lngLat.toString().split('t')[1]});
      let fromDialog = document.getElementById("toMapDialog") as HTMLDialogElement;
      fromDialog.close();
    });
       
    this.select = document.getElementById("carplate-select") as HTMLSelectElement; 
    this.loadCarplates(this.orderForm.value);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }  

  loadCarplates(orderData) {
    this.clearCarplates();
    if (orderData.weight == 0 || orderData.weight == null ||
    orderData.volume == 0 || orderData.volume == null ||
    orderData.deadline === '' || orderData.deadline == null) {
      return;
    }
    
    let order = new Order();
    order.source = {longitude: '', latitude: ''};
    order.destination = {longitude: '', latitude: ''};
    order.volume = orderData.volume.toString();
    order.weight = orderData.weight.toString();
    order.car_id = '';
    order.description ='';
    order.deadline = orderData.deadline.replace('T', ' ') + ':00.0';
    order.admins_id = this.currentUser.id;
    order.title  = '';

    console.log(JSON.stringify(order));
    this.orderService.getDriversList(order).subscribe( (result: Driver[]) => {
      console.log(result);
      result.forEach(val => this.carplates.push(Object.assign({}, val)));
      console.log(this.carplates);
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

  clearCarplates() {
    this.carplates.length = 0;
    this.select.options.length = 0;
    this.select.selectedIndex = -1;
    this.updateDriverName();
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

  onSubmit(orderData) {

    this.clearErrorMessages();

    if (this.validate(orderData)) {

      let order = new Order();
      let from =  orderData.from.replace('(','').replace(')','').split(',');
      let to =  orderData.to.replace('(','').replace(')','').split(',');
      order.source = {longitude: from[1], latitude: from[0]};
      order.destination = {longitude: to[1], latitude: to[0]};
      order.volume = orderData.volume.toString();
      order.weight = orderData.weight.toString();
      order.car_id = this.carplates[this.select.selectedIndex].carPlate.toString();
      order.description  = orderData.description;
      order.deadline = orderData.deadline.replace('T', ' ') + ':00.0';
      order.admins_id = this.currentUser.id;
      order.title  = orderData.title;

      this.subscriptions.push(
        this.orderService.createOrder(order).subscribe(
          (result) => {
              this.router.navigate(['/app/admin']);
          },
          (error) => {
            this.drivernameMessage = 'Server error: ' + error.error.message;
            this.orderForm.patchValue({title: '', description: '', weight: 0, volume: 0, from: '', to: '', deadline: ''});
            this.clearCarplates();
          }
        ));
    }
  }

  validate(orderData): boolean {
    let invalid = false;

     if (orderData.title === '' || orderData.title == null) {
      this.titleMessage = 'Title cannot be empty';
      invalid = true;
    }  /*else if (!orderData.title.match(
      '^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$')) {
      this.titleMessage = 'Incorrect title';
    } */

    if (orderData.description === '' || orderData.description == null) {
      this.descriptionMessage = 'Description cannot be empty';
      invalid = true;
    }/* else if (!orderData.password.match('.{6,}')) {
      this.descriptionMessage = 'Description must be 6 characters long at least';
    } */

    if (orderData.weight == 0 || orderData.weight == null) {
      this.weightMessage = 'Weight cannot be zero';
      invalid = true;
    } 

    if (orderData.volume == 0 || orderData.volume == null) {
      this.volumeMessage = 'Volume cannot be zero';
      invalid = true;
    } 

    if (orderData.from === '' || orderData.from == null) {
      this.fromMessage = 'From cannot be empty';
      invalid = true;
    } 

    if (orderData.to === '' || orderData.to == null) {
      this.toMessage = 'To cannot be empty';
      invalid = true;
    } 
    
    if (this.carplates[this.select.selectedIndex].carPlate === '' || this.carplates[this.select.selectedIndex].carPlate == null) {
      this.carplateMessage = 'Carplate cannot be empty';
      invalid = true;
    }

    if (orderData.deadline === '' || orderData.deadline == null) {
      this.deadlineMessage = 'Deadline cannot be empty';
      invalid = true;
    } 


    return !invalid;
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
}
