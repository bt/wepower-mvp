import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import * as moment from 'moment';

import {EthereumService} from "../../shared/ethereum.service";
import {ExchangeRateService} from "../exchange-rate.service";
import {Period} from "../../shared/period";
import {ProductionReviewRow} from "../production-review-row";
import {ProductionDetails} from "../production-details";
import {ConsumptionPredictionService} from "../../registration/prediction/consumption-prediction.service";
import {ConsumptionReviewService} from "../consumption-review.service";
import {ConsumptionDetails} from "../consumption-details";
import {ConsumptionReviewRow} from "../consumption-review-row";
import { DataFiller } from "app/shared/data-filler.service";

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer-dashboard.component.html',
  styleUrls: ['./consumer-dashboard.component.css']
})
export class ConsumerDashboardComponent implements OnInit {

  // TODO: Extract components.

  walletBalance : number;
  walletBalanceEur : number;
  exchangeRate : number;

  consumedTotal : number;
  headerPeriod : Period;

  consumptionReview : Array<ConsumptionReviewRow>;
  tableReviewPeriod: Period;


  constructor(private ethereum : EthereumService,
              private exchangeMarket : ExchangeRateService,
              private predictionService : ConsumptionPredictionService,
              private consumptionReviewService : ConsumptionReviewService) { }

  ngOnInit() {
    this.loadHeaderData();
    this.initializeTable();
  }

  previousPeriod() {
    this.tableReviewPeriod = this.tableReviewPeriod.plusWeeks(-1)
    this.loadTable(this.tableReviewPeriod);
  }

  nextPeriod() {
    this.tableReviewPeriod = this.tableReviewPeriod.plusWeeks(1)
    this.loadTable(this.tableReviewPeriod);
  }

  private initializeTable() {
    let periodStart = moment().startOf('week').add(1, 'days')

    this.tableReviewPeriod = new Period(
      periodStart.toDate(),
      periodStart.clone().add(6, 'day').toDate()
    );

    this.loadTable(this.tableReviewPeriod);
  }

  private loadTable(period : Period) {
    Promise.all(
      [
        this.consumptionReviewService.getConsumptionDetails(this.ethereum.activeWallet(), period).toPromise(),
        this.exchangeMarket.exchangeRate().toPromise()
      ]
    ).then(values => {
      let consumptionDetails: Array<ConsumptionDetails> = values[0]
      let exchangeRate = values[1]
      // Hardcoded

      let price: number = 25

      let consumptionRows = consumptionDetails.map(consumptionForDay => {
          return new ConsumptionReviewRow(
            consumptionForDay.date,
            consumptionForDay.prediction,
            consumptionForDay.consumption,
            price,
            price / exchangeRate,
            price * consumptionForDay.prediction,
          )
        }
      )

      this.consumptionReview = this.fillEmptyForWeek(consumptionRows)
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
        this.walletBalanceEur = this.walletBalance / this.exchangeRate
      }
    )

    let periodStart = moment().startOf('week').add(1, 'day');
    this.headerPeriod = new Period(
      periodStart.toDate(),
      periodStart.clone().add(1, 'week').toDate()
    );
    this.loadTotalPrediction(this.headerPeriod);
  }

  private loadTotalPrediction(reviewPeriod : Period) {
    this.predictionService.getPredictionTotal(this.ethereum.activeWallet(), reviewPeriod)
      .subscribe(
        predictions => this.consumedTotal = predictions,
        error => console.error(error)
      );
  }

  private fillEmptyForWeek(reviews: Array<ConsumptionReviewRow>) : Array<ConsumptionReviewRow> {
    return (DataFiller.fillForWeek(reviews, ConsumptionReviewRow.emptyForDay) as Array<ConsumptionReviewRow>)
  }
}
