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
import {RegistrationStateService} from "app/shared/registration-state.service";
import {ConsumptionPredictionService} from "app/registration/prediction/consumption-prediction.service";
import {TokensHandlerService} from "app/dashboard/tokens-handler.service";
import {TransactionData} from "../../shared/transaction-data";

@Component({
  selector: 'app-client-consumption-review',
  templateUrl: './client-consumption-review.component.html',
  styleUrls: ['./client-consumption-review.component.scss']
})
export class ClientConsumptionReviewComponent implements OnInit {

  backDisabled: boolean
  frontDisabled: boolean

  consumptionReview: Array<ConsumptionReviewRow>
  tableReviewPeriod: Period = new Period(new Date(), new Date())
  walletId: string
  buying = false
  transferring = false
  availableRange: Period

  details: { [key: number]: Array<BuyTokensRow>; } = {};

  transferAddress = ''
  transferValue = 0
  transferDate: Date

  constructor(private ethereum: EthereumService,
              private exchangeMarket: ExchangeRateService,
              private predictionService: ConsumptionPredictionService,
              private consumptionReviewService: ConsumptionReviewService,
              private tokensHandlerService: TokensHandlerService,
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
    this.adjustButtonActivity()
  }

  nextPeriod() {
    this.tableReviewPeriod = this.tableReviewPeriod.plusWeeks(1)
    this.loadTable(this.tableReviewPeriod);
    this.adjustButtonActivity()
  }

  prepareTransferData(transferDate: Date, value: number) {
      this.transferAddress = ''
      this.transferValue = value
      this.transferDate = transferDate
  }

  transferTokens() {
      this.transferring = true

      this.tokensHandlerService
          .transferTokens(this.walletId, this.transferAddress, this.transferValue, this.transferDate)
          .subscribe(
              data => {
                  this.loadTable(this.tableReviewPeriod)
                  this.transferring = false
              },
              error => {
                  console.log(error),
                  this.transferring = false
              })

  }

  buyTokens(plant: string, amount: number, date: Date, price: number) {
      this.buying = true
      this.tokensHandlerService.buyTokens(plant, amount, date, price).subscribe(
          data => {
              this.loadTable(this.tableReviewPeriod)
              this.buying = false
                },
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

    isBefore(date: Date): boolean {
        let currentDate = moment()
        let dateToCompare = moment(date)

        return dateToCompare.isBefore(currentDate)
    }

    validateTransferAddress(): boolean {
      return this.ethereum.isAddress(this.transferAddress)
    }

  private initializeTable() {
    let periodStart = moment().startOf('week').add(1, 'days')

    this.tableReviewPeriod = new Period(
      periodStart.toDate(),
      periodStart.clone().add(6, 'day').toDate()
    );

    this.loadTable(this.tableReviewPeriod)
    this.loadAvailablePeriod()
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
            this.round(price, 6),
            this.round(price / exchangeRate, 6),
            this.round(price * consumptionForDay.prediction, 6),
            null
          )
        }
      )

      let updates: Array<any> = [];

      consumptionRows.forEach(consumptionForDay =>
          updates.push(
              Promise.all([
                  this.ethereum.getOwned(this.walletId, consumptionForDay.date).toPromise(),
                  this.transactionLogs.transactionsConsumer(this.walletId, consumptionForDay.date).toPromise(),
                  this.ethereum.getSourceOf(this.walletId, consumptionForDay.date).toPromise()
              ]).then(vals => {
                  consumptionForDay.tokens = vals[0]
                  consumptionForDay.type = vals[2] != null ? Number(vals[2]) : null
                  if (vals[0] > 0) {
                      consumptionForDay.priceEth = 0
                      vals[1].forEach((val: TransactionData) => consumptionForDay.paidEth += Number(val.amountEth))
                      consumptionForDay.paidEth = this.round(consumptionForDay.paidEth, 6)
                      consumptionForDay.priceEth = this.round(consumptionForDay.paidEth / consumptionForDay.tokens, 6)
                      consumptionForDay.priceEur = this.round(consumptionForDay.priceEth * exchangeRate, 6)
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

    private loadAvailablePeriod() {
        this.predictionService.getPredictedPeriod(this.walletId)
            .subscribe(
                period => {
                    this.availableRange = period
                    this.adjustButtonActivity()
                },
                error => console.error(error)
            );
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
