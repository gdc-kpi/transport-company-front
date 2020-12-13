import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { DriverServiceService } from '../_services/driver-service.service';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { Dayoff } from '../_models/dayoff';


@Component({
  selector: 'app-show-days-off',
  templateUrl: './show-days-off.component.html',
  styleUrls: ['./show-days-off.component.css']
})
export class ShowDaysOffComponent implements OnInit {
  subscriptions: Subscription[] = [];
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

  currentUser: User;
  daysoff: Dayoff[] = [];
  // carplates: Driver[]=[];
  // select: HTMLSelectElement;


  constructor(private router: Router,
              private driverService: DriverServiceService,
              private authenticationService: AuthenticationService) {
        this.currentUser = authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.currentUser == null ||
      this.currentUser.role !== 'driver') {
      this.router.navigate(['/']);
  }
    // this.select = document.getElementById("carplate-select") as HTMLSelectElement; 
    // this.loadCarplates(this.orderForm.value);

    this.daysoff = [
      {date: 'today yopta', approved: 'nahui nada'},
      {date: 'forever vyhidnyy', approved: 'nie'},
      {date: '21.01.021', approved: '_'}
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  // loadCarplates(orderData) {
  //   this.clearCarplates();
  //   if (orderData.weight == 0 || orderData.weight == null ||
  //   orderData.volume == 0 || orderData.volume == null ||
  //   orderData.deadline === '' || orderData.deadline == null) { 
  //     return;
  //   }
    
  //   let order = new Order();
  //   order.source = {longitude: '', latitude: ''};
  //   order.destination = {longitude: '', latitude: ''};
  //   order.volume = orderData.volume.toString();
  //   order.weight = orderData.weight.toString();
  //   order.car_id = '';
  //   order.description ='';
  //   order.admins_id = this.currentUser.id;
  //   order.deadline = orderData.deadline.replace('T', ' ') + ':00.0';
  //   order.title  = '';

  //   this.orderService.getDriversList(order).subscribe( (result: Driver[]) => {

  //     result.forEach(val => this.carplates.push(Object.assign({}, val)));
  //     for(let index in this.carplates) {        
  //       this.select.options[this.select.options.length] = new Option(this.carplates[index].carPlate.toString(), this.carplates[index].carPlate.toString());
  //     }
  //     this.updateDriverName();
  //   },
  //   (error) => {
  //     this.drivernameMessage = 'Server error: ' + error.error.message;
  //   });  
  // }

  // clearCarplates() {
  //   this.carplates.length = 0;
  //   this.select.options.length = 0;
  //   this.select.selectedIndex = -1;
  //   this.updateDriverName();
  // }

  // updateDriverName() {
  //   if (this.select.selectedIndex < 0) {
  //     return;
  //   }
  //   if (this.carplates[this.select.selectedIndex].fullname) {
  //     this.orderForm.patchValue({drivername: this.carplates[this.select.selectedIndex].fullname.toString()});
  //   }
  //   else {
  //     this.orderForm.patchValue({drivername: ''});
  //   }
  // }
}