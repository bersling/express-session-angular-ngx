import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {environment} from '../environments/environment';
import {Subject} from 'rxjs/Subject';
import {ToastrService} from 'ngx-toastr';

interface Balance {
  balance: number
}

@Injectable()
export class AccountBalanceService {

  accountBalance: Subject<Balance | null>;

  getAccountBalance() {
    const req = this.http.get(environment.apiUrl + '/balance', {
      withCredentials: true
    });
    req.subscribe((balance: Balance) => {
      this.accountBalance.next(balance);
    }, errorResp => {
      if (errorResp.status === 403) {
        // TODO: redirect to login
      }
      this.toastr.error(errorResp.error && errorResp.error.errorMessage ?
        errorResp.error.errorMessage :  'Oops, something went wrong.');
    });
  }

  constructor(private http: HttpClient,
              private authService: AuthService,
              private toastr: ToastrService) {
    this.accountBalance = new Subject();
    this.authService.loggedIn.subscribe(() => {
      this.accountBalance.next(null);
    });
  }

}
