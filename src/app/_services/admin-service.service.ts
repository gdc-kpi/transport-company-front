import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Vehicle } from '../_models/vehicle';
import { Order2 } from '../_models/order2';
import { Order } from '../_models/order';
import { Driver } from '../_models/driver';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public currentUser: Observable<User>;
  private url = environment.apiUrl + 'api/admin/';
  private readonly httpOptions = {
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

  getAllCars(): Observable<Map<String, Vehicle>> {
    return this.http.get<Map<String, Vehicle>>(this.url + 'all-vehicles',
      { headers: this.httpOptions.headers });
  }

  getOrders(type: string, admin: string): Observable<Order2[]> {
    return this.http.get<Order2[]>(this.url + admin + '/orders/' + type,
      { headers: this.httpOptions.headers });
  }

  inviteAdmin(fullname: string, email: string): Observable<any> {
    return this.http.post<any>(this.url + 'invite-admin', JSON.stringify({fullname, password: ' ', email }),
      this.httpOptions);
  }

  createCar(plate: string, capacity: string, loadCapacity: string, fuelConsumption: string): Observable<any> {
    return this.http.post<any>(this.url + 'add-vehicle', JSON.stringify({plate, capacity, loadCapacity, fuelConsumption}),
      this.httpOptions);
  }

  getDrivers(fullname: string): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.url + 'drivers',
      { headers: this.httpOptions.headers, params: new HttpParams().set('fullname', fullname) });
  }

  getVehicleFilter(plate: string): Observable<Map<String, Vehicle>> {
    return this.http.get<Map<String, Vehicle>>(this.url + 'vehicles',
      { headers: this.httpOptions.headers, params: new HttpParams().set('plate', plate) });
  }

  getDaysOff(): Observable<any> {
    return this.http.get<any>(this.url + 'days-off',
      { headers: this.httpOptions.headers });
  }

  changeDayOffStatus(driverId: string, date: Date, isApproved: string): Observable<any> {
    const dates = new Array(date);
    const dayInfo = {
      driverId,
      dates,
      isApproved
    };
    return this.http.post<any>(this.url + 'approve-days-off', JSON.stringify(dayInfo), this.httpOptions);
  }
}
