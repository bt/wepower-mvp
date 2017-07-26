import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { RegistrationStateService } from "../../shared/registration-state.service";
import { EthereumService } from "../../shared/ethereum.service";
import "rxjs/add/operator/mergeMap";

@Injectable()
export class ConsumerDashboardGuardService implements CanActivate {

  constructor(private registrationState : RegistrationStateService,
              private ethereumService : EthereumService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.ethereumService.activeWallet()
      .mergeMap(wallet => {
        if (!wallet) {
          return Observable.throw("No wallet is present")
        }

        return this.registrationState.isActive(wallet, 'CONSUMER')
      })
      .map(allowed => this.checkStatus(allowed))
      .catch(error => {
        console.error(error)
        return Observable.of(this.checkStatus(false))
      })
  }

  checkStatus(allowed : boolean) : boolean {
    if (!allowed) {
      this.router.navigateByUrl("/")
    }

    return true
  }
}
