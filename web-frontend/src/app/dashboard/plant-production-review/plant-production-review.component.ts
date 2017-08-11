import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import { Period } from "../../shared/period";
import { ProductionReviewRow } from "../production-review-row";
import { EthereumService } from "../../shared/ethereum.service";
import { ExchangeRateService } from "../exchange-rate.service";
import { ProductionReviewService } from "../production-review.service";
import { DataFiller } from "../../shared/data-filler.service";
import { ProductionDetails } from "../production-details";
import {ProductionPredictionService} from "../../registration/prediction/production-prediction.service";
import {Observable} from "rxjs/Observable";
import {TransactionsLogService} from "../../shared/transactions-log-service";

@Component({
  selector: 'app-plant-production-review',
  templateUrl: './plant-production-review.component.html',
  styleUrls: ['./plant-production-review.component.scss']
})
export class PlantProductionReviewComponent implements OnInit {

  backDisabled: boolean
  frontDisabled: boolean

  productionReview: Array<ProductionReviewRow>
  tableReviewPeriod: Period = new Period(new Date(), new Date())
  walletId: string

  availableRange: Period

  constructor(private ethereum: EthereumService,
              private exchangeMarket: ExchangeRateService,
              private predictionService: ProductionPredictionService,
              private productionReviewService: ProductionReviewService,
              private transactionLog: TransactionsLogService) { }

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

    this.loadAvailablePeriod()
    this.loadTable(this.tableReviewPeriod)
  }

  previousPeriod() {
    this.tableReviewPeriod = this.tableReviewPeriod.plusWeeks(-1)
    this.loadTable(this.tableReviewPeriod)
    this.adjustButtonActivity()
  }

  nextPeriod() {
    this.tableReviewPeriod = this.tableReviewPeriod.plusWeeks(1)
    this.loadTable(this.tableReviewPeriod)
    this.adjustButtonActivity()
  }

    private loadAvailablePeriod() {
        this.predictionService.getPredictedPeriod(this.walletId)
            .subscribe(
                period => {
                    this.availableRange = period
                    this.adjustButtonActivity()},
                error => console.error(error)
            )
    }

  totalAmount(date: Date): Observable<number> {
    return this.ethereum.getTotalAmount(this.walletId, date.getTime())
  }

  private loadTable(period: Period) {
    Promise.all(
      [
        this.productionReviewService.getProductionDetails(this.walletId, period).toPromise(),
        this.exchangeMarket.exchangeRate().toPromise()
      ]
    ).then(values => {
      const productionDetails: Array<ProductionDetails> = values[0]
      const exchangeRate = values[1]
      const price = 0

      const reviewDetails = productionDetails.map(productionForDay => {
          return new ProductionReviewRow(
            productionForDay.date,
            productionForDay.prediction,
            productionForDay.production,
            0,
            price,
            price / exchangeRate,
            price * 0,
            0
          )
        }
      )

        const updates: Array<any> = [];

        reviewDetails.forEach(productionForDay =>
            updates.push(
                Promise.all([
                    this.totalAmount(productionForDay.date).toPromise(),
                    this.ethereum.getOwned(this.walletId, productionForDay.date).toPromise(),
                    this.transactionLog.transactionsPlant(this.walletId, productionForDay.date).toPromise()
                ]).then(values => {
                    productionForDay.totalTokens = Number(values[0])
                    productionForDay.sold = Number(values[0]) - Number(values[1])
                    values[2].forEach((val) => productionForDay.receivedEth += Number(val)  )

                })
            ))

        Promise.all(updates)
            .then(values => { this.productionReview = this.fillForWeek(reviewDetails) })

    })
  }

  private fillForWeek(reviews: Array<ProductionReviewRow>): Array<ProductionReviewRow> {
    return (DataFiller.fillForWeek(reviews, ProductionReviewRow.emptyForDay) as Array<ProductionReviewRow>)
  }

    private adjustButtonActivity() {
        if (this.tableReviewPeriod == null || this.availableRange) {
            this.backDisabled = true
            this.frontDisabled = true
        }

        this.backDisabled = false
        if (this.tableReviewPeriod.from <= this.availableRange.from) {
            this.backDisabled = true
        }

        this.frontDisabled = false
        if (this.tableReviewPeriod.to >= this.availableRange.to) {
            this.frontDisabled = true
        }
    }
}
