import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  currentUser: Observable<User>;
  isLoggedIn: boolean;
  isAdmin: boolean;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  
    this.currentUser = this.authenticationService.currentUserObservable;
    this.currentUser.subscribe(val => {
      this.isLoggedIn = val != null;
      console.log(val.role)
      this.isAdmin = val != undefined && val != null && val.role == "admin"
      console.log(this.isAdmin)
    })

  }

  signOut() {
    this.authenticationService.signoutUser();
    this.router.navigate(['/']);
  }

}
