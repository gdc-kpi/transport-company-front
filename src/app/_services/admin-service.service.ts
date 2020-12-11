import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Vehicle } from '../_models/vehicle';
import { Order } from '../_models/order';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private url = environment.apiUrl + 'api/admin/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      observe: 'response',

    })
  };

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('userData'),
        observe: 'response',

      })
    }
  }

  getAllCars(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.url + 'all-vehicles',
      { headers: this.httpOptions.headers });
  }

  getOrders(type:string, admin:string): Observable<Order[]> {
    return this.http.get<Order[]>(this.url + admin + '/orders/' + type,
      { headers: this.httpOptions.headers });
  }

          

  inviteAdmin(fullname: string, email: string): Observable<any> {
    return this.http.post<any>(this.url + 'invite-admin', JSON.stringify({fullname, password: " ", email }),
      this.httpOptions);
  }
}
