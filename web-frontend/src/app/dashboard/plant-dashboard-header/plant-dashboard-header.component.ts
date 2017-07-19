import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { Period } from "../../shared/period";
import { MarketPriceRow } from "../market-price-row";
import { ProductionPredictionService } from "../../registration/prediction/production-prediction.service";
import { EthereumService } from "../../shared/ethereum.service";
import { ElectricityMarketPriceService } from "../electricity-market-price.service";

@Component({
  selector: 'app-plant-dashboard-header',
  templateUrl: './plant-dashboard-header.component.html',
  styleUrls: ['./plant-dashboard-header.component.scss']
})
export class PlantDashboardHeaderComponent implements OnInit {

  producedTotal : number;
  headerPeriod : Period;
  marketPricesReview : Array<MarketPriceRow>;


  constructor(private predictionService : ProductionPredictionService,
              private ethereum : EthereumService,
              private electricityPriceService : ElectricityMarketPriceService) { }

  ngOnInit() {
    this.loadData()
  }

  private loadData() {
    this.headerPeriod = new Period(
      moment().startOf('isoWeek').toDate(),
      moment().startOf('isoWeek').add(6, 'day').toDate()
    );
    this.loadTotalPrediction(this.headerPeriod);
    this.loadMarketReview();
  }

  private loadMarketReview() {
    let marketReviewEnd = moment().add(1, 'days')
    let marketReviewStart = marketReviewEnd.clone().subtract(6, 'day')

    let marketReviewPeriod = new Period(
      marketReviewStart.toDate(),
      marketReviewEnd.toDate()
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

  private loadTotalPrediction(reviewPeriod : Period) {
    this.predictionService.getPredictionTotal(this.ethereum.activeWallet(), reviewPeriod)
      .subscribe(
        predictions => this.producedTotal = predictions,
        error => console.error(error)
      );
  }
}
