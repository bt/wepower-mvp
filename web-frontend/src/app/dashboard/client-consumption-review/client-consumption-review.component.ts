import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import { ConsumptionReviewRow } from "../consumption-review-row";
import { Period } from "../../shared/period";
import { EthereumService } from "../../shared/ethereum.service";
import { ExchangeRateService } from "../exchange-rate.service";
import { ConsumptionReviewService } from "../consumption-review.service";
import { ConsumptionDetails } from "../consumption-details";
import { DataFiller } from "../../shared/data-filler.service";
import {ProductionPredictionService} from "../../registration/prediction/production-prediction.service";
import {reject} from "q";
import {PlantType} from "../../registration/plant-form/plant-form";
import {toPromise} from "rxjs/operator/toPromise";
import {BuyTokensRow} from "../buy-tokens-row";

@Component({
  selector: 'app-client-consumption-review',
  templateUrl: './client-consumption-review.component.html',
  styleUrls: ['./client-consumption-review.component.scss']
})
export class ClientConsumptionReviewComponent implements OnInit {

  consumptionReview: Array<ConsumptionReviewRow>
  tableReviewPeriod: Period = new Period(new Date(), new Date())
  walletId: string

  availableRange: Period

  details: { [key: number]: Array<BuyTokensRow>; } = {};

  constructor(private ethereum: EthereumService,
              private exchangeMarket: ExchangeRateService,
              private predictionService: ProductionPredictionService,
              private consumptionReviewService: ConsumptionReviewService) { }


  ngOnInit() {
    this.ethereum.activeWallet()
      .subscribe(
        wallet => {
          this.walletId = wallet
          this.initializeTable();
        },
        error => console.error(error)
      )
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

  isAfter(date: Date): boolean {
    let currentDate = moment()
    let dateToCompare = moment(date)

    return dateToCompare.isAfter(currentDate)
  }

  private initializeTable() {
    let periodStart = moment().startOf('week').add(1, 'days')

    this.tableReviewPeriod = new Period(
      periodStart.toDate(),
      periodStart.clone().add(6, 'day').toDate()
    );

    this.loadTable(this.tableReviewPeriod)
  }

  private loadTable(period: Period) {
    Promise.all(
      [
        this.consumptionReviewService.getConsumptionDetails(this.walletId, period).toPromise(),
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
            price * consumptionForDay.prediction
          )
        }
      )

      let updates: Array<any> = [];

      consumptionRows.forEach(consumptionForDay =>
            updates.push(new Promise((resolve, reject) => {
                this.ethereum.getOwned(this.walletId, consumptionForDay.date).subscribe(
                    data => {
                        consumptionForDay.prediction = data
                        resolve(true)
                    },
                    error => reject
                )})))

        Promise.all(updates)
            .then(values => { this.consumptionReview = this.fillEmptyForWeek(consumptionRows) })
    })
  }

  loadDetails(date: Date, amount: number): void {
    if (this.details[date.getTime()]) {
        return
    }
    Promise.all([
        this.bestPrice(amount, date, PlantType.HYDRO),
        this.bestPrice(amount, date, PlantType.SOLAR),
        this.bestPrice(amount, date, PlantType.WIND)
    ]).then(values => {
        this.details[date.getTime()] = values;
    })
  }

  bestPrice(amount: number, date: Date, type: PlantType): Promise<BuyTokensRow> {
    return this.ethereum.getBestPrice(amount, date, type)
        .mergeMap(data => {
            return this.ethereum.getPrice(data)
        }).map(data => {
            return new BuyTokensRow(date, amount, type, data, 0, data * amount, null)
        }).toPromise()
  }

  private fillEmptyForWeek(reviews: Array<ConsumptionReviewRow>): Array<ConsumptionReviewRow> {
    return (DataFiller.fillForWeek(reviews, ConsumptionReviewRow.emptyForDay) as Array<ConsumptionReviewRow>)
  }

}
