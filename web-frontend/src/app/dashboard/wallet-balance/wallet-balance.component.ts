import {Component, OnInit} from '@angular/core';
import {EthereumService} from "../../shared/ethereum.service";
import {ExchangeRateService} from "../exchange-rate.service";
import {PriceService} from "../price.service";
import {TokensHandlerService} from "../tokens-handler.service";

@Component({
    selector: 'app-wallet-balance',
    templateUrl: './wallet-balance.component.html',
    styleUrls: ['./wallet-balance.component.scss']
})
export class WalletBalanceComponent implements OnInit {

    walletBalance: number;
    walletBalanceEur: number;
    exchangeRate: number;

    constructor(private ethereum: EthereumService,
                private priceService: PriceService,
                private tokensHandler: TokensHandlerService,
                private exchangeMarket: ExchangeRateService) {
    }

    ngOnInit() {
        const self_ = this
        this.priceService.priceChange.subscribe(
            data => self_.loadBalance()
        )
        this.tokensHandler.tokensChange.subscribe(
            data => self_.loadBalance()
        )
        self_.loadBalance()
    }

    private loadBalance() {
        Promise.all(
            [
                this.ethereum.walletBalance().toPromise(),
                this.exchangeMarket.exchangeRate().toPromise()
            ]
        ).then(values => {
                this.walletBalance = this.round(this.ethereum.weiToETH(values[0]), 6)
                this.exchangeRate = values[1]
                this.walletBalanceEur = this.round(this.walletBalance * this.exchangeRate, 6)
            }
        )
    }

    private round(number: number, precision: number) {
        const factor = Math.pow(10, precision);
        const roundedTempNumber = Math.round(number * factor);
        return roundedTempNumber / factor;
    };

}
