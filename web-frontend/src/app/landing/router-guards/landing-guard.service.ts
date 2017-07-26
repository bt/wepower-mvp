import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/fromPromise'
import "rxjs/add/operator/mergeMap";

import { RegistrationStateService } from "../../shared/registration-state.service";
import { EthereumService } from "../../shared/ethereum.service";
import { WalletType } from "../../shared/wallet-type.enum";
import { Observable } from "rxjs/Observable";
import { WalletDetails } from "../../dashboard/wallet-details";

@Injectable()
export class LandingGuardService implements CanActivate {

  constructor(private registrationState : RegistrationStateService,
              private ethereumService : EthereumService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.ethereumService.activeWallet()
      .mergeMap(wallet => {
        if (!wallet) {
          return Observable.throw("Active wallet is not present")
        }

        return this.registrationState.getActiveWalletDetails(wallet)
      })
      .map(details => this.manageLandingRedirects(details))
      .catch(error => {
        console.error(error)

        // If something failed along the way, we redirect to landing
        return Observable.of(true)
      })
  }

  manageLandingRedirects(details : WalletDetails) : boolean {
    if (details == null) {
      return true
    }

    let type = details.walletType

    if (type == null) {
       return true
    }

    switch (type) {
      case WalletType.PLANT:
        this.router.navigateByUrl("/dashboard/plant")
        break
      case WalletType.CONSUMER:
        this.router.navigateByUrl("/dashboard/consumer")
        break
      default:
        console.error("Unknown wallet type:" + type)
        return true
    }
  }
}
