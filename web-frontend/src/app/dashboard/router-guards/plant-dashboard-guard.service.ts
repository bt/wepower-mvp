import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { RegistrationStateService } from "../../shared/registration-state.service";
import { EthereumService } from "../../shared/ethereum.service";

@Injectable()
export class PlantDashboardGuardService implements CanActivate {

  constructor(private registrationState : RegistrationStateService,
              private ethereumService : EthereumService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let walletId = this.ethereumService.activeWallet();
    return this.registrationState.isActive(walletId, 'PLANT')
      .map(allowed => this.checkStatus(allowed))
  }

  checkStatus(allowed : boolean) : boolean {
    if (!allowed) {
      this.router.navigateByUrl("/")
    }

    return true
  }
}
