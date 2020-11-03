import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class DriverServiceService {

  private currentUserSubject: BehaviorSubject<User>;
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
    }
  }


  getDriversCar(uuid : String): Observable<any> {
    return this.http.get<any>(this.url + uuid + '/vehicle',
      { headers: this.httpOptions.headers });
  }

}
