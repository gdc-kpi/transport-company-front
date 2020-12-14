import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { DriverServiceService } from '../_services/driver-service.service';
import { AdminService } from '../_services/admin-service.service';
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
              private adminService: AdminService,
              private authenticationService: AuthenticationService) {
        this.currentUser = authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.currentUser == null) {
      this.router.navigate(['/']);
    }

    this.isAdmin = this.currentUser.role === 'admin';

    this.load();
  }

  routeBack(): void {
    if (this.authenticationService.currentUserRole === 'driver') {
      this.router.navigate(['/app/driver']);
    } else {
      this.router.navigate(['/app/admin']);
    }
  }

  load(): void {
    this.daysoff = [];
    if (this.isAdmin) {
      this.adminService.getDaysOff().subscribe( (result: any) => {
          result.forEach(val => {
            this.daysoff.push(
              {date: val.date, status: 'Pending', driverName: val.fullname, driverId: val.user_id}
            );
          });
        },
        (error) => {
        });
    } else {
      this.driverService.getDaysOff(this.currentUser.id).subscribe( (result: any) => {
          result.forEach(val => {
            this.daysoff.push(
              {date: val.second.split('T')[0], driverName: this.currentUser.fullname, driverId: this.currentUser.id,
                status: val.first === 'true' ? 'Approved' : val.first === 'false' ? 'Rejected' : 'Pending'}
            );
          });
        },
        (error) => {
        });
    }
  }

  async changeDayOffStatus(dayoff, status: string): Promise<void> {
    this.isDisabled = true;
    this.adminService.changeDayOffStatus(dayoff.driverId, dayoff.date, status).subscribe();
    await this.delay(2000);
    this.load();
    this.isDisabled = false;
  }

  delay(ms: number): any {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
