import {Component, NgZone} from '@angular/core';
import {EthereumService} from "./shared/ethereum.service";


const contract = require('truffle-contract');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private monitoringAccount = false

    constructor(private etherium: EthereumService, private _ngZone: NgZone) {
    }

    ngOnInit() {
        this.etherium.activeWallet().subscribe(
            account => this.monitorAccountChange(this, account))
    }

    private monitorAccountChange(self_: AppComponent, currentAccount: string): void {
        if (self_.monitoringAccount) {
            return
        }
        self_.monitoringAccount = true

        // HACK https://github.com/MetaMask/faq/issues/52
        setInterval(() => {
            self_.etherium.activeWallet().subscribe(
                account => {
                    if ((currentAccount == null && account != null) || account !== currentAccount) {
                        currentAccount = account

                        // hard reload if user changed - guards should handle navigation
                        self_._ngZone.runOutsideAngular(() => location.reload())
                    }
                },
                console.error
            )
        }, 1000);
    }
}
