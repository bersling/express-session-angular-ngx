import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { environment } from '../environments/environment';

@Injectable()
export class AuthService {

  loggedIn: BehaviorSubject<boolean>;

  getToken(): string {
    return window.localStorage['jwtToken'];
  }

  saveToken(token: string) {
    window.localStorage['jwtToken'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

  buildHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.getToken()) {
      headersConfig['Authorization'] = `Token ${this.getToken()}`;
    }
    return new HttpHeaders(headersConfig);
  }


  login(email: string, password: string) {
    this.http.post(environment.apiUrl + '/login', {
      email: email,
      password: password
    }).subscribe((resp: any) => {
      this.loggedIn.next(true);
      this.saveToken(resp.token);
      this.toastr.success(resp && resp.user && resp.user.name ? `Welcome ${resp.user.name}` : 'Logged in!');
    }, (errorResp) => {
      this.loggedIn.next(undefined);
      errorResp.error ? this.toastr.error(errorResp.error.errorMessage) : this.toastr.error('An unknown error has occured.');
    });
  }

  logout() {
    this.destroyToken();
    this.loggedIn.next(false);
  }

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    const jwtToken = this.getToken();
    this.loggedIn = new BehaviorSubject<boolean>(jwtToken ? true : false);
  }

}
