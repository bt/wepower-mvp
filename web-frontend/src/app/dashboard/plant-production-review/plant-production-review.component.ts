import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import { Period } from "../../shared/period";
import { ProductionReviewRow } from "../production-review-row";
import { EthereumService } from "../../shared/ethereum.service";
import { ExchangeRateService } from "../exchange-rate.service";
import { ProductionReviewService } from "../production-review.service";
import { DataFiller } from "../../shared/data-filler.service";
import { ProductionDetails } from "../production-details";

@Component({
  selector: 'app-plant-production-review',
  templateUrl: './plant-production-review.component.html',
  styleUrls: ['./plant-production-review.component.scss']
})
export class PlantProductionReviewComponent implements OnInit {

  productionReview : Array<ProductionReviewRow>
  tableReviewPeriod: Period
  walletId : string

  constructor(private ethereum : EthereumService,
              private exchangeMarket : ExchangeRateService,
              private productionReviewService : ProductionReviewService) { }

  ngOnInit() {
    this.ethereum.activeWallet()
      .subscribe(
        wallet => {
          this.walletId = wallet
          this.initializeTable()
        },
        error => console.error(error)
      )
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
        this.productionReviewService.getProductionDetails(this.walletId, period).toPromise(),
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

  private fillForWeek(reviews: Array<ProductionReviewRow>) : Array<ProductionReviewRow> {
    return (DataFiller.fillForWeek(reviews, ProductionReviewRow.emptyForDay) as Array<ProductionReviewRow>)
  }
}
