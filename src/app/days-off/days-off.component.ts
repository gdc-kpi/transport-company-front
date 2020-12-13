import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { DriverServiceService } from '../_services/driver-service.service';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';


@Component({
  selector: 'app-days-off',
  templateUrl: './days-off.component.html',
  styleUrls: ['./days-off.component.css']
})
export class DaysOffComponent implements OnInit {
  subscriptions: Subscription[] = [];
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

  daysoffForm;
  startingMessage: string;
  endingMessage: string;
  currentUser: User;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private driverService: DriverServiceService,
              private authenticationService: AuthenticationService) {
        this.currentUser = authenticationService.currentUserValue;
        this.daysoffForm = this.formBuilder.group({
          starting: '',
          ending: '',
        });
  }

  ngOnInit(): void {
    if (this.currentUser == null) {
      this.router.navigate(['/']);
    }
  }


  onSubmit(daysoffData) {
      this.clearErrorMessages();
  
      if (this.validate(daysoffData)) {
      let days = this.listDays(new Date(daysoffData.starting), new Date(daysoffData.ending));

        this.subscriptions.push(
          this.driverService.setDaysOff(days).subscribe(
            (result) => {
                this.router.navigate(['/app/show-days-off']);
            },
            (error) => {
              this.daysoffForm.starting = null;
              this.daysoffForm.ending = null;
              this.endingMessage = error.error.message;
            }
          ));
      }
    }

    listDays(startDate: Date, endDate: Date): Date[] {
    let dates = [];
    while (startDate <= endDate) { 
        dates.push(startDate);
        startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
    }

  
    validate(daysoffData): boolean {
      let error = false;
      if (daysoffData.starting === '' || daysoffData.starting == null) {
        this.startingMessage = 'Starting Date cannot be empty';
        error = true;
      } // else if (!daysoffData.email.match(
      //   '^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$')) {
      //   this.emailMessage = 'Incorrect email';
      // }
  
      if (new Date(daysoffData.starting) < new Date(new Date().setHours(0,0,0,0))) {
        this.endingMessage = 'Starting Date cannot be earlier then Today';
        error = true;
      }

      if (daysoffData.ending === '' || daysoffData.ending == null) {
        this.endingMessage = 'Ending Date cannot be empty';
        error = true;
      } //else if (!daysoffData.password.match('.{6,}')) {
      //   this.passwordMessage = 'Password must be 6 characters long at least';
  
      // }

      if (new Date(daysoffData.ending) < new Date(daysoffData.starting)) {
        this.endingMessage = 'Ending Date cannot be earlier then Starting Date';
        error = true;
      }
  
      return !error;
    }
  
    clearErrorMessages() {
      this.startingMessage = null;
      this.endingMessage = null;
    }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}