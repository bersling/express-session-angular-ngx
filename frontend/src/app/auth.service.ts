import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import { environment } from '../environments/environment';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class AuthService {

  loggedIn: Subject<boolean>;

  doLogin(email: string, password: string) {
    this.http.post(environment.apiUrl + '/login', {
      email: email,
      password: password
    }, {
      withCredentials: true
    }).subscribe((resp: any) => {
      this.loggedIn.next(true);
      this.toastr.success(resp && resp.user && resp.user.name ? `Welcome ${resp.user.name}` : 'Logged in!');
    }, (errorResp) => {
      this.loggedIn.next(false);
      errorResp.error ? this.toastr.error(errorResp.error.errorMessage) : this.toastr.error('An unknown error has occured.');
    });
  }

  getLogin() {
    this.http.get(environment.apiUrl + '/login', {
      withCredentials: true
    }).subscribe((resp: any) => {
      console.log(resp.loggedIn);
      this.loggedIn.next(resp.loggedIn);
    }, (errorResp) => this.toastr.error('Oops, something went wrong getting the logged in status'))
  }


  logout() {
    this.http.post(environment.apiUrl + '/logout', {}, {
      withCredentials: true
    }).subscribe(() => {
      this.loggedIn.next(false);
    });
  }

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.loggedIn = new Subject();
    this.getLogin();
  }

}
