import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Driver } from '../_models/driver';
import { Order } from '../_models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private url = environment.apiUrl + 'api/';
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

  getDriversList(order: Order): Observable<Driver[]> {
    return this.http.post<Driver[]>(this.url + 'drivers-list', JSON.stringify(order), this.httpOptions );
  }

  createOrder(order: Order): Observable<any> {
    return this.http.post<any>(this.url + 'order', JSON.stringify(order), this.httpOptions);
  }
}
