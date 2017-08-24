import { Injectable } from '@angular/core';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'
import {ExchangeRateService} from "./exchange-rate.service";
import {PriceLogService} from "../shared/price-log-service";
import {EthereumService} from "../shared/ethereum.service";
import {Subject} from "rxjs/Subject";

@Injectable()
export class PriceService {

    priceChange: Subject<number> = new Subject<number>();

    constructor(
      private ethereum: EthereumService,
      private priceLog: PriceLogService,
      private exchangeRateService: ExchangeRateService) {
  }

  changePrice(wallet: string, price: number): Observable<any> {
        const self_ = this

        return this.exchangeRateService.exchangeRate()
            .mergeMap(exchangeRate => {
                const priceEth = self_.round(price / Number(exchangeRate), 6)
                return self_.ethereum.setPrice(wallet, self_.ethereum.ethToWei(priceEth))})
            .mergeMap(data => self_.priceLog.log(wallet, price))
            .mergeMap(data => self_.loadPrice(wallet))
            .catch(error => {
                console.error(error)
                return self_.loadPrice(wallet)
            })
    }

    loadPrice(wallet: string): Observable<any> {
        const self_ = this
        return this.ethereum.getPrice(wallet)
            .mergeMap(price => Observable.of(price = self_.ethereum.weiToETH(price)))
            .mergeMap(price =>
                self_.exchangeRateService.exchangeRate()
                    .mergeMap(rate => Observable.of(self_.round(price * rate, 6)))
            )
            .map(price => self_.priceChange.next(price))
    }

    round(number: number, precision: number) {
        const factor = Math.pow(10, precision)
        const roundedTempNumber = Math.round(number * factor)
        return roundedTempNumber / factor
    }
}
