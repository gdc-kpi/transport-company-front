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

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService

  ) { 
    this.activated = undefined;
    this.subscriptions.push(
      this.authenticationService.activate(this.route.snapshot.paramMap.get('key')).subscribe(
        (result) => {
          this.activated = true;
        },
        (error) => {
        }
      ));
  }
  

  ngOnInit(): void {
  }

}
