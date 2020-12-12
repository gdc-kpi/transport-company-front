import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

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
}
