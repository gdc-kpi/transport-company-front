import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../_models/order';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShowOrderServiceService {

  public currentUser: Observable<User>;
  private url = environment.apiUrl + 'api';
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
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + localStorage.getItem('userData'),
        observe: 'response',
      })
    };
  }
  getPath(orderId: string): Observable<Array<Object>> {
    return this.http.get<Array<Object>>(this.url + '/order/' + orderId + '/path',
      { headers: this.httpOptions.headers });
  }
}
