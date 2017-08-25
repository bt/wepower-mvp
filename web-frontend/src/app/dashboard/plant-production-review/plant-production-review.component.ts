import {Component, OnInit} from '@angular/core';

import * as moment from 'moment';

import {Period} from "../../shared/period";
import {ProductionReviewRow} from "../production-review-row";
import {EthereumService} from "../../shared/ethereum.service";
import {ExchangeRateService} from "../exchange-rate.service";
import {ProductionReviewService} from "../production-review.service";
import {DataFiller} from "../../shared/data-filler.service";
import {ProductionDetails} from "../production-details";
import {ProductionPredictionService} from "../../registration/prediction/production-prediction.service";
import {Observable} from "rxjs/Observable";
import {TransactionsLogService} from "../../shared/transactions-log-service";
import {PriceLogService} from "../../shared/price-log-service";
import {PriceService} from "../price.service";

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
                private transactionLog: TransactionsLogService,
                private priceService: PriceService,
                private priceLog: PriceLogService) {
    }

    ngOnInit() {
        this.priceService.priceChange.subscribe(
            price => this.loadTable(this.tableReviewPeriod)
        )
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
                    this.adjustButtonActivity()
                },
                error => console.error(error)
            )
    }

    private loadTable(period: Period) {

        const self_ = this

        Promise.all(
            [
                this.productionReviewService.getProductionDetails(this.walletId, period).toPromise(),
                this.exchangeMarket.exchangeRate().toPromise(),
                this.ethereum.getPrice(this.walletId).toPromise()
            ]
        ).then(values => {
            const productionDetails: Array<ProductionDetails> = values[0]
            const exchangeRate = values[1]
            const price = values[2] ? this.ethereum.weiToETH(values[2]) : 0

            const reviewDetails = productionDetails.map(productionForDay => {
                    return new ProductionReviewRow(
                        productionForDay.date,
                        productionForDay.prediction,
                        productionForDay.production,
                        0,
                        this.round(price, 6),
                        this.round(price * exchangeRate, 6),
                        0,
                        0
                    )
                }
            )

            const updates: Array<any> = [];

            reviewDetails.forEach(productionForDay =>
                updates.push(
                    Promise.all([
                        this.ethereum.getTotalAmount(this.walletId, productionForDay.date).toPromise(),
                        this.ethereum.getOwned(this.walletId, productionForDay.date).toPromise(),
                        this.transactionLog.transactionsPlant(this.walletId, productionForDay.date).toPromise(),
                        this.priceLog.getFor(this.walletId, productionForDay.date).toPromise()
                    ]).then(vals => {
                        productionForDay.totalTokens = Number(vals[0])
                        productionForDay.sold = Number(vals[0]) - Number(vals[1])
                        vals[2].forEach((val) => productionForDay.receivedEth += Number(val))
                        productionForDay.receivedEth = self_.round(productionForDay.receivedEth, 6)

                        if (vals[3] && moment(productionForDay.date).isAfter(moment(Date())) && vals[3] !== 0) {
                            productionForDay.priceEur = this.round(vals[3], 6)
                            productionForDay.priceEth = this.round(vals[3] / exchangeRate, 6)
                        }
                    })
                ))

            Promise.all(updates)
                .then(vals => {
                    this.productionReview = this.fillForWeek(reviewDetails)
                })

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

    private round(number: number, precision: number) {
        const factor = Math.pow(10, precision)
        const roundedTempNumber = Math.round(number * factor)
        return roundedTempNumber / factor
    };
}
