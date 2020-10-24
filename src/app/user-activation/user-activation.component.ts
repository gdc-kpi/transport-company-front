import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.css']
})
export class UserActivationComponent implements OnInit {
  subscriptions: Subscription[] = [];
  activated: boolean
  errorMessage :string

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService

  ) { 
    this.activated = undefined;
  }
  

  ngOnInit(): void {
    this.subscriptions.push(
      this.authenticationService.activate(this.route.snapshot.queryParams['key']).subscribe(
        (result) => {
          this.activated = true;
        },
        (error) => {
          this.activated = false;
          this.errorMessage = error.error.message;
        }
      ));
  }

}
