import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../_models/order';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class DriverServiceService {
  public currentUser: Observable<User>;
  private url = environment.apiUrl + 'api/driver/';
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

  getDriversCar(uuid: string): Observable<any> {
    return this.http.get<any>(this.url + uuid + '/vehicle',
      { headers: this.httpOptions.headers });
  }

  chooseDriversCar(uuid: string, carplate: string): Observable<any> {
    return this.http.get<any>(this.url + uuid + '/choose-car',
      { headers: this.httpOptions.headers,  params: new HttpParams().set('plate', carplate) });
  }

  getFreeCars(): Observable<any> {
    return this.http.get<any>(this.url + 'free-vehicles',
      { headers: this.httpOptions.headers });
  }
  
  getOrders(type: string, driver: string): Observable<Order[]> {
    return this.http.get<Order[]>(this.url + driver + '/orders/' + type,
      { headers: this.httpOptions.headers });
  }

  rejectOrder(orderId: string): any {
    return this.http.patch(environment.apiUrl + 'api/order/status/' + orderId + '?status=REJECTED',
      {}, { headers: this.httpOptions.headers });
  }

  confirmOrder(orderId: string): any {
    return this.http.patch(environment.apiUrl + 'api/order/status/' + orderId + '?status=CONFIRMED',
      {}, { headers: this.httpOptions.headers });
  }
}
