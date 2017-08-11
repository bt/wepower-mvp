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
import {TransactionsLogService} from "../../shared/transactions-log-service";

@Component({
  selector: 'app-client-consumption-review',
  templateUrl: './client-consumption-review.component.html',
  styleUrls: ['./client-consumption-review.component.scss']
})
export class ClientConsumptionReviewComponent implements OnInit {

  consumptionReview: Array<ConsumptionReviewRow>
  tableReviewPeriod: Period = new Period(new Date(), new Date())
  walletId: string
  buying = false
  availableRange: Period

  details: { [key: number]: Array<BuyTokensRow>; } = {};

  tranfferData: {
      address: string,
      value: number
  }

  constructor(private ethereum: EthereumService,
              private exchangeMarket: ExchangeRateService,
              private predictionService: ProductionPredictionService,
              private consumptionReviewService: ConsumptionReviewService,
              private transactionLogs: TransactionsLogService) { }


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

  transferTokens() {
      /*this.transactionLogs.transactionsConsumerPlant(this.walletId, )
          .mergeMap(data => this.ethereum.transfer(data, this.tranfferData.address))
          .subscribe(
              data => null,
              error => console.log)*/

  }

  buyTokens(plant: string, amount: number, date: Date, price: number) {
      this.buying = true
      this.ethereum.buy(plant, amount, date, price).subscribe(
          data => this.buying = false,
          error => {
              console.error(error)
              this.buying = false
      })
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
      let price: number = 0

      let consumptionRows = consumptionDetails.map(consumptionForDay => {
          return new ConsumptionReviewRow(
            consumptionForDay.date,
            consumptionForDay.prediction,
            0,
            consumptionForDay.consumption,
            price,
            price / exchangeRate,
            price * consumptionForDay.prediction
          )
        }
      )

      let updates: Array<any> = [];

      consumptionRows.forEach(consumptionForDay =>
          updates.push(
              Promise.all([
                  this.ethereum.getOwned(this.walletId, consumptionForDay.date).toPromise(),
                  this.transactionLogs.transactionsConsumer(this.walletId, consumptionForDay.date).toPromise()
              ]).then(vals => {
                  consumptionForDay.tokens = vals[0]
                  if (vals[0] > 0) {
                      consumptionForDay.priceEth = 0
                      vals[1].forEach((val) => consumptionForDay.priceEth += Number(val))
                      consumptionForDay.priceEur = consumptionForDay.priceEth * exchangeRate
                      consumptionForDay.paidEth = consumptionForDay.tokens * consumptionForDay.paidEth
                  }
              })
          ))

        Promise.all(updates)
            .then(vals => { this.consumptionReview = this.fillEmptyForWeek(consumptionRows) })
    })
  }

  loadDetails(date: Date, amount: number): void {
    if (this.details[date.getTime()]) {
        return
    }
    this.exchangeMarket.exchangeRate().toPromise()
        .then(rate =>
             Promise.all([
                this.bestPrice(amount, date, PlantType.HYDRO, rate),
                this.bestPrice(amount, date, PlantType.SOLAR, rate),
                this.bestPrice(amount, date, PlantType.WIND, rate)
            ]))
        .then(values => {
            this.details[date.getTime()] = values;
        })
  }

  bestPrice(amount: number, date: Date, type: PlantType, exchangeRate: number): Promise<BuyTokensRow> {
    let bestPriceAddr: string
    return this.ethereum.getBestPrice(amount, date, type)
        .mergeMap(data => {
            bestPriceAddr = data
            return this.ethereum.getPrice(data)
        }).map(price => {
            const priceInEth: number = this.ethereum.weiToETH(price)
            return new BuyTokensRow(date, amount, type, this.round(priceInEth, 6),
                this.round(priceInEth * exchangeRate, 6), this.round(priceInEth * amount, 6), bestPriceAddr)
        }).toPromise()
  }

  private fillEmptyForWeek(reviews: Array<ConsumptionReviewRow>): Array<ConsumptionReviewRow> {
    return (DataFiller.fillForWeek(reviews, ConsumptionReviewRow.emptyForDay) as Array<ConsumptionReviewRow>)
  }

    private round(number: number, precision: number) {
        var factor = Math.pow(10, precision);
        var tempNumber = number * factor;
        var roundedTempNumber = Math.round(tempNumber);
        return roundedTempNumber / factor;
    };

}
