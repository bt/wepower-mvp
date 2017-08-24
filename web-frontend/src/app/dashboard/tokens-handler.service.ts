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
export class TokensHandlerService {

    tokensChange: Subject<number> = new Subject<number>();

    constructor(
      private ethereum: EthereumService,
      private priceLog: PriceLogService,
      private exchangeRateService: ExchangeRateService) {
  }

  buyTokens(plant: string, amount: number, date: Date, price: number): Observable<any> {
      const self_ = this;

      return this.ethereum.buy(plant, amount, date, price)
          .mergeMap(data => {
              self_.tokensChange.next(amount)
              return Observable.of(true)
          })
  }

  transferTokens(wallet: string, to: string, amount: number, date: Date): Observable<any> {
      const self_ = this;

      return this.ethereum.getProducerOf(wallet, date)
          .mergeMap(plantAddress =>
              self_.ethereum.transfer(plantAddress, to, amount, date))
          .mergeMap(data => {
              self_.tokensChange.next(amount)
              return Observable.of(true)
          })
  }

}
