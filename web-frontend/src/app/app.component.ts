import {Component} from '@angular/core';
import {Router} from "@angular/router";

import {EthereumService} from "./shared/ethereum.service";
import {ExistingUserGuardService} from "./landing/router-guards/existing-user-guard.service";


const contract = require('truffle-contract');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    balance: number;
    etherium: EthereumService
    existingUserGuard: ExistingUserGuardService
    router: Router

    private monitoringAccount = false

    constructor(etherium: EthereumService,
                existingUserGuard: ExistingUserGuardService,
                router: Router) {
        this.etherium = etherium
        this.existingUserGuard = existingUserGuard
        this.router = router
    }

    ngOnInit() {
        this.monitorAccountChange(null)
    }

    private monitorAccountChange(currentAccount: string): void {
        if (this.monitoringAccount) {
            return
        }
        this.monitoringAccount = true
        // HACK https://github.com/MetaMask/faq/issues/52
        setInterval(() => {
            this.etherium.activeWallet().subscribe(
                data => {
                    if (data !== currentAccount) {
                        currentAccount = data
                        // existingUserGuard handles existing plants/consumers navigation to dashboard
                        // if their data don't exist navigate to root.
                        // This is needed because if always navigate to '/' it won't get refreshed
                        // after user changes and existingUserGuard won't fire
                        this.existingUserGuard.canActivate(null, null).subscribe(
                            response => response ? this.router.navigateByUrl('/') : null,
                            error => console.error
                        )
                    }
                },
                console.error
            )
        }, 1000);
    }
}
