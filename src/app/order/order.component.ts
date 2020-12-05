import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// import { AdminService } from '../_services/admin-service.service';
import { Vehicle } from '../_models/vehicle';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { OrderServiceService } from '../_services/order-service.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  subscriptions: Subscription[] = [];

  currentUser: User;
  orderForm: FormGroup;
  carplates: Vehicle[]=[];
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
    this.loadCarplates();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  onSubmit(orderData) {
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


  loadCarplates() {
    this.orderService.getDriversList().subscribe( (result: Vehicle[]) => {

      result.forEach(val => this.carplates.push(Object.assign({}, val)));
      for(let index in this.carplates) {        
        this.select.options[this.select.options.length] = new Option(this.carplates[index].plate.toString(), this.carplates[index].plate.toString());
      }
      
      this.updateDriverName();
    },
    (error) => {
    });  
  }

  updateDriverName() {
    if (this.carplates[this.select.selectedIndex].userId) {
      this.orderForm.patchValue({drivername: this.carplates[this.select.selectedIndex].userId.toString()});
    }
    else {
      this.orderForm.patchValue({drivername: ''});
    }
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
}
