import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user'
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
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
  private recoveryUrl = environment.apiUrl + 'api/recovery/';
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

  public get currentUserObservable(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentUserRole(): String {
    return this.currentUserSubject.value.role;
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
        return userDecode; 
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
    return this.http.patch<any>(this.url + 'activate', null,
      { headers: this.httpOptions.headers, params: { key } });
  }


  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(this.recoveryUrl + 'send', JSON.stringify({email}),
      this.httpOptions);
  }
      
  confirmPasswordReset(key: string): Observable<any> {
    return this.http.get<any>(this.recoveryUrl + 'confirm',
    { headers: this.httpOptions.headers, params: { key } });
  }
      

  changePassword(recoveryLink: string, password: string): Observable<any> {
    return this.http.patch<any>(this.recoveryUrl + 'change-password', JSON.stringify({recoveryLink, password: this.passwordHashing(password, this.PASSWORD_HASHING_ITERATIONS_AMOUNT)}),
      this.httpOptions);
  }
  


  adminActivate(key: string, password: string): Observable<any> {
    return this.http.patch<any>(this.url + 'admin-activate', JSON.stringify({password: this.passwordHashing(password, this.PASSWORD_HASHING_ITERATIONS_AMOUNT), key}),
    this.httpOptions);
  }

  signoutUser(): void {
    localStorage.removeItem('userData');
    this.currentUserSubject.next(null);
  }
  
}
