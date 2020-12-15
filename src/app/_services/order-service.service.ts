import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Driver } from '../_models/driver';
import { Order } from '../_models/order';
import { Order2 } from '../_models/order2';

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

  getDriversList(order: Order): Observable<Driver[]> {
    return this.http.post<Driver[]>(this.url + 'drivers-list', JSON.stringify(order), this.httpOptions );
  }

  createOrder(order: Order): Observable<any> {
    return this.http.post<any>(this.url + 'order', JSON.stringify(order), this.httpOptions);
  }

  getOrder(orderId: string): Observable<Order2> {
    return this.http.get<Order2>(this.url + 'order/' + orderId,
      { headers: this.httpOptions.headers });
  }

  getPath(orderId: string): Observable<Array<object>> {
    return this.http.get<Array<object>>(this.url + orderId + '/path',
      { headers: this.httpOptions.headers });
  }

  getDriversList2(order: Order2): Observable<Driver[]> {
    return this.http.post<Driver[]>(this.url + 'drivers-list', JSON.stringify(order), this.httpOptions );
  }

  assignDriver(orderId: string, driverid: string): any {
    return this.http.patch(environment.apiUrl + 'api/order/' + orderId + '?driver=' + driverid,
      {}, { headers: this.httpOptions.headers });
  }
}
