import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import {Order} from '../_models/order';

@Injectable({
  providedIn: 'root'
})

export class OrderServiceService {
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
    };
  }

  getDriversList(): Observable<any> {
    return this.http.get<any>(this.url + 'drivers-list',
      { headers: this.httpOptions.headers });
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(this.url + 'order/' + orderId,
      { headers: this.httpOptions.headers });
  }

  getPath(orderId: string): Observable<Array<object>> {
    return this.http.get<Array<object>>(this.url + orderId + '/path',
      { headers: this.httpOptions.headers });
  }
}
