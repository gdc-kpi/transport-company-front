/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { OrderServiceService } from '../_services/order-service.service';
import { Router } from '@angular/router';
import {} from "googlemaps";
import { AfterViewInit, ViewChild, ElementRef } from 
'@angular/core';
import { Subscription } from 'rxjs';
// import { AdminService } from '../_services/admin-service.service';
import { Vehicle } from '../_models/vehicle';
import { User } from '../_models/user';
import { Order } from '../_models/order';
import { Driver } from '../_models/driver';
import { concatAll } from 'rxjs/operators';

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
    this.select = document.getElementById("carplate-select") as HTMLSelectElement; 
    this.loadCarplates(this.orderForm.value);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  fromClick(event: google.maps.MouseEvent) {
    this.orderForm.patchValue({from: event.latLng.toString()});
    let fromDialog = document.getElementById("fromMapDialog") as HTMLDialogElement;
    fromDialog.close();
  }
  
  toClick(event: google.maps.MouseEvent) {
    this.orderForm.patchValue({to: event.latLng.toString()});
    let toDialog = document.getElementById("toMapDialog") as HTMLDialogElement;
    toDialog.close();
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
    order.admins_id = this.currentUser.id;
    order.deadline = orderData.deadline.replace('T', ' ') + ':00.0';
    order.title  = '';

    this.orderService.getDriversList(order).subscribe( (result: Driver[]) => {

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
      order.source = {longitude: from[0], latitude: from[1]};
      order.destination = {longitude: to[0], latitude: to[1]};
      order.volume = orderData.volume.toString();
      order.weight = orderData.weight.toString();
      order.car_id = this.carplates[this.select.selectedIndex].carPlate;
      order.description  = orderData.description;
      order.admins_id = this.currentUser.id;
      order.deadline = orderData.deadline.replace('T', ' ') + ':00.0';
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

  clearErrorMessages() {
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
