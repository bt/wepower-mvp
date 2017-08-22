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
                    if (currentAccount == null) {
                        currentAccount = data
                    } else if (data !== currentAccount) {
                        // hard reload if user changed - guards should handle navigation
                        this._ngZone.runOutsideAngular(() => location.reload())
                    }
                },
                console.error
            )
        }, 1000);
    }
}
