import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { Period } from "../../shared/period";
import { MarketPriceRow } from "../market-price-row";
import { ConsumptionPredictionService } from "../../registration/prediction/consumption-prediction.service";
import { EthereumService } from "../../shared/ethereum.service";
import { ElectricityMarketPriceService } from "../electricity-market-price.service";

@Component({
  selector: 'app-client-dashboard-header',
  templateUrl: './client-dashboard-header.component.html',
  styleUrls: ['./client-dashboard-header.component.scss']
})
export class ClientDashboardHeaderComponent implements OnInit {

  consumedTotal : number;
  headerPeriod : Period;
  marketPricesReview : Array<MarketPriceRow>;
  walletId : string

  constructor(private predictionService : ConsumptionPredictionService,
              private ethereum : EthereumService,
              private electricityPriceService : ElectricityMarketPriceService) { }

  ngOnInit() {
    let periodStart = moment().startOf('week').add(1, 'day');
    this.headerPeriod = new Period(
      periodStart.toDate(),
      periodStart.clone().add(1, 'week').toDate()
    );

    this.ethereum.activeWallet()
      .subscribe(
        wallet => {
          this.walletId = wallet
          this.loadTotalPrediction(this.headerPeriod);
          this.loadMarketData()
        },
        error => console.error(error)
      )
  }

  private loadTotalPrediction(reviewPeriod : Period) {
    this.predictionService.getPredictionTotal(this.walletId, reviewPeriod)
      .subscribe(
        predictions => this.consumedTotal = predictions,
        error => console.error(error)
      );
  }

  private loadMarketData() {
    let periodEnd = moment().add(1, 'days')
    let periodStart = periodEnd.clone().subtract(6, 'day')

    let marketReviewPeriod = new Period(
      periodStart.toDate(),
      periodEnd.toDate()
    );

    // Expected to add prices from contracts, which will have to be merged.
    Promise.all(
      [
        this.electricityPriceService.getElectricityPrices(marketReviewPeriod).toPromise()
      ]
    ).then(values => {
      let marketPrices = values[0]

      // Prices from contract will have to be added later
      this.marketPricesReview = marketPrices
        .map(priceForDay => new MarketPriceRow(priceForDay[0], priceForDay[1], 25))
    }).catch(error => console.error(error))
  }

}
