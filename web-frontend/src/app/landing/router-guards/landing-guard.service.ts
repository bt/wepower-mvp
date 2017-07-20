import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/observable/of'

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
    if (!this.ethereumService.isActiveConnection()) {
      return Observable.of(true)
    }

    let walletAddress = this.ethereumService.activeWallet();

    return this.registrationState.getActiveWalletDetails(walletAddress)
       .map(details => this.manageLandingRedirects(details))
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
