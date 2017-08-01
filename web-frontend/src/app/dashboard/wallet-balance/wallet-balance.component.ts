import { Component, OnInit } from '@angular/core';
import { EthereumService } from "../../shared/ethereum.service";
import { ExchangeRateService } from "../exchange-rate.service";

@Component({
  selector: 'app-wallet-balance',
  templateUrl: './wallet-balance.component.html',
  styleUrls: ['./wallet-balance.component.scss']
})
export class WalletBalanceComponent implements OnInit {

  walletBalance : number;
  walletBalanceEur : number;
  exchangeRate : number;

  constructor(private ethereum : EthereumService,
              private exchangeMarket : ExchangeRateService) { }

  ngOnInit() {
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
        var factor = Math.pow(10, precision);
        var tempNumber = number * factor;
        var roundedTempNumber = Math.round(tempNumber);
        return roundedTempNumber / factor;
    };

}
