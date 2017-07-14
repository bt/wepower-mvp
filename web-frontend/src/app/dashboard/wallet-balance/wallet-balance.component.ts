import { Component, OnInit } from '@angular/core';
import { EthereumService } from "../../shared/ethereum.service";
import { ExchangeRateService } from "../exchange-rate.service";

@Component({
  selector: 'app-wallet-balance',
  templateUrl: './wallet-balance.component.html',
  styleUrls: ['./wallet-balance.component.css']
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
        this.ethereum.walletBalance(),
        this.exchangeMarket.exchangeRate().toPromise()
      ]
    ).then(values => {
        this.walletBalance = this.ethereum.weiToETH(values[0])
        this.exchangeRate = values[1]
        this.walletBalanceEur = this.walletBalance * this.exchangeRate
      }
    )
  }

}
