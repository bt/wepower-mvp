import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import { ConsumptionReviewRow } from "../consumption-review-row";
import { Period } from "../../shared/period";
import { EthereumService } from "../../shared/ethereum.service";
import { ExchangeRateService } from "../exchange-rate.service";
import { ConsumptionReviewService } from "../consumption-review.service";
import { ConsumptionDetails } from "../consumption-details";
import { DataFiller } from "../../shared/data-filler.service";

@Component({
  selector: 'app-client-consumption-review',
  templateUrl: './client-consumption-review.component.html',
  styleUrls: ['./client-consumption-review.component.scss']
})
export class ClientConsumptionReviewComponent implements OnInit {

  consumptionReview : Array<ConsumptionReviewRow>;
  tableReviewPeriod: Period;

  constructor(private ethereum : EthereumService,
              private exchangeMarket : ExchangeRateService,
              private consumptionReviewService : ConsumptionReviewService) { }


  ngOnInit() {
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

  sendTokens() {

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

  private fillEmptyForWeek(reviews: Array<ConsumptionReviewRow>) : Array<ConsumptionReviewRow> {
    return (DataFiller.fillForWeek(reviews, ConsumptionReviewRow.emptyForDay) as Array<ConsumptionReviewRow>)
  }
}
