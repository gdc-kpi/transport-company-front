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

  isDisabled = false;
  isAdmin;

  constructor(private router: Router,
              private driverService: DriverServiceService,
              private authenticationService: AuthenticationService) {
        this.currentUser = authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.currentUser == null) {
      this.router.navigate(['/']);
    }

    this.isAdmin = this.currentUser.role === 'admin';

    this.driverService.getDaysOff(this.currentUser.id).subscribe( (result: any) => {
          result.forEach(val => {
            this.daysoff.push(
              {date: val.second.split('T')[0], status: !!val.first ? 'Approved' : 'Pending',
                driverName: this.currentUser.fullname}
              );
          });
        },
        (error) => {
        });
  }

  routeBack(): void {
    if (this.authenticationService.currentUserRole === 'driver') {
      this.router.navigate(['/app/driver']);
    } else {
      this.router.navigate(['/app/admin']);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
