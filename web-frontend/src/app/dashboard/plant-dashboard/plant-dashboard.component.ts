import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import * as moment from 'moment';

import {EthereumService} from "../../shared/ethereum.service";
import {ExchangeRateService} from "../exchange-rate.service";
import {ProductionPredictionService} from "../../registration/prediction/production-prediction.service";
import {Period} from "../../shared/period";
import {ProductionReviewRow} from "../production-review-row";
import {PredictionData} from "../../registration/prediction-review/prediction-data";
import {ProductionReviewService} from "../production-review.service";
import {ProductionDetails} from "../production-details";
import { DataFiller } from "../../shared/data-filler.service";
import { MarketPriceRow } from "../market-price-row";
import { ElectricityMarketPriceService } from "../electricity-market-price.service";

@Component({
  selector: 'app-plant',
  templateUrl: './plant-dashboard.component.html',
  styleUrls: ['./plant-dashboard.component.css']
})
export class PlantDashboardComponent implements OnInit {

  // TODO: Extract components.

  walletBalance : number;
  walletBalanceEur : number;
  exchangeRate : number;

  producedTotal : number;
  headerPeriod : Period;

  productionReview : Array<ProductionReviewRow>;
  tableReviewPeriod: Period;

  marketPricesReview : Array<MarketPriceRow>;


  constructor(private ethereum : EthereumService,
              private exchangeMarket : ExchangeRateService,
              private predictionService : ProductionPredictionService,
              private productionReviewService : ProductionReviewService,
              private electricityPriceService : ElectricityMarketPriceService) { }

  ngOnInit() {
    this.loadHeaderData();
    this.initializeTable();

    let periodEnd = moment().add(1, 'days')
    let periodStart = periodEnd.clone().subtract(6, 'day')

    let marketReviewPeriod = new Period(
      periodStart.toDate(),
      periodStart.clone().add(6, 'day').toDate()
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

  private initializeTable() {
    let periodStart = moment().startOf('week').add(1, 'days')

    this.tableReviewPeriod = new Period(
      periodStart.toDate(),
      periodStart.clone().add(6, 'day').toDate()
    );

    this.loadTable(this.tableReviewPeriod);
  }

  previousPeriod() {
    this.tableReviewPeriod = this.tableReviewPeriod.plusWeeks(-1)
    this.loadTable(this.tableReviewPeriod);
  }

  nextPeriod() {
    this.tableReviewPeriod = this.tableReviewPeriod.plusWeeks(1)
    this.loadTable(this.tableReviewPeriod);
  }

  private loadTable(period : Period) {
    Promise.all(
      [
        this.productionReviewService.getProductionDetails(this.ethereum.activeWallet(), period).toPromise(),
        this.exchangeMarket.exchangeRate().toPromise()
      ]
    ).then(values => {
      let productionDetails: Array<ProductionDetails> = values[0]
      let exchangeRate = values[1]
      // Hardcoded
      let produced: number = 3000
      let sold: number = 1000
      let price: number = 25

      let reviewDetails = productionDetails.map(productionForDay => {
          return new ProductionReviewRow(
            productionForDay.date,
            productionForDay.prediction,
            productionForDay.production,
            sold,
            price,
            price / exchangeRate,
            price * sold,
          )
        }
      )
      this.productionReview = this.fillForWeek(reviewDetails)
    })
  }

  private loadHeaderData() {
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
    ).catch(error => console.error(error))

    this.headerPeriod = new Period(
      moment().startOf('isoWeek').toDate(),
      moment().startOf('isoWeek').add(6, 'day').toDate()
    );
    this.loadTotalPrediction(this.headerPeriod);
  }

  private loadTotalPrediction(reviewPeriod : Period) {
    this.predictionService.getPredictionTotal(this.ethereum.activeWallet(), reviewPeriod)
      .subscribe(
        predictions => this.producedTotal = predictions,
        error => console.error(error)
      );
  }

  private fillForWeek(reviews: Array<ProductionReviewRow>) : Array<ProductionReviewRow> {
    return (DataFiller.fillForWeek(reviews, ProductionReviewRow.emptyForDay) as Array<ProductionReviewRow>)
  }
}
