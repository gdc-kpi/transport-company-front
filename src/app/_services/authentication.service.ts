import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user'
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import * as sha1 from 'js-sha1';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  public readonly PASSWORD_HASHING_ITERATIONS_AMOUNT = 5;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private url = environment.apiUrl + 'api/auth/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      observe: 'response',

    })
  };

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      localStorage.getItem('userData') ? jwt_decode(localStorage.getItem('userData')) : undefined);
    this.currentUser = this.currentUserSubject.asObservable();
  }


  private passwordHashing(password: string, iterations?: number) {
    let crypt = sha1(password);
    for (let i = 0; i < iterations; ++i) {
      crypt = sha1(crypt);
    }
    return crypt;
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public logIn(email: string, password: string): Observable<User> {

    const userInfo = {
      email,
      password: this.passwordHashing(password, this.PASSWORD_HASHING_ITERATIONS_AMOUNT)
    };

    return this.http.post<User>(this.url + 'log-in', JSON.stringify(userInfo), this.httpOptions).pipe(
      map(data => {
          const tokenJSON: any = data;
          localStorage.setItem('userData', tokenJSON.token);
          const userDecode: User = jwt_decode(tokenJSON.token);
          this.currentUserSubject.next(userDecode);
          return userDecode; //TODO check
      })
  );
  }

  public signUp(email: string, fullname: string, password: string): Observable<User> {
    const userInfo = {
      email,
      fullname,
      password: this.passwordHashing(password, this.PASSWORD_HASHING_ITERATIONS_AMOUNT)
    };
    return this.http.post<User>(this.url + 'sign-up', JSON.stringify(userInfo), this.httpOptions);
  }


  activate(key: string): Observable<any> {
    return this.http.post<any>(this.url + 'activate', null,
        { headers: this.httpOptions.headers, params: { key } }); //TODO adjust checl
}

}
