import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// import { OrderService } from '../_services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  subscriptions: Subscription[] = [];

  orderForm;
  titleMessage: string;
  descriptionMessage: string;
  weightMessage: string;
  volumeMessage: string;
  toMessage: string;
  fromMessage: string;
  carplateMessage: string;
  deadlineMessage: string;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    /*private orderService: OrderService*/) {
    this.orderForm = this.formBuilder.group({
      title: '',
      description: '',
    });
  }

  ngOnInit(): void {

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
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
