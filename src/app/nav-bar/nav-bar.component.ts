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
  link: string = '/'

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  
    this.currentUser = this.authenticationService.currentUserObservable;
    this.currentUser.subscribe(val => {
      this.isLoggedIn = val != null;
      this.isAdmin = val != undefined && val != null && val.role == "admin"
      this.link = (!this.isLoggedIn) ? "/" : (this.isAdmin) ? '/app/admin' : '/app/driver'
    })

  }

  signOut() {
    this.authenticationService.signoutUser();
    this.router.navigate(['/']);
  }

}
