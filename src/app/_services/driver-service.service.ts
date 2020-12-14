import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../_models/order';
import { Order2 } from '../_models/order2';
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

  getOrders(type: string, driver: string): Observable<Order2[]> {
    return this.http.get<Order2[]>(this.url + driver + '/orders/' + type,
      { headers: this.httpOptions.headers });
  }

  changeOrderStatus(orderId: string, status: string): any {
    return this.http.patch(environment.apiUrl + 'api/order/status/' + orderId + '?status=' + status,
      {}, { headers: this.httpOptions.headers });
  }

  getDaysOff(driverId: string): Observable<any> {
    return this.http.get<any>(this.url + driverId + '/days-off',
      { headers: this.httpOptions.headers });
  }

  setDaysOff(days: Date[]): Observable<any> {
    return this.http.post<any>(this.url + 'set-days-off', JSON.stringify(days), this.httpOptions);
  }
}
