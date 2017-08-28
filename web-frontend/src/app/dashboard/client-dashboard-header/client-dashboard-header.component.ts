import {Component, OnInit} from '@angular/core';

import * as moment from 'moment';
import {Period} from "../../shared/period";
import {MarketPriceRow} from "../market-price-row";
import {ConsumptionPredictionService} from "../../registration/prediction/consumption-prediction.service";
import {EthereumService} from "../../shared/ethereum.service";
import {ElectricityMarketPriceService} from "../electricity-market-price.service";
import {TokensHandlerService} from "../tokens-handler.service";
import {TransactionsLogService} from "../../shared/transactions-log-service";
import {Observable} from "rxjs/Observable";
import {TransactionData} from "../../shared/transaction-data";
import {ExchangeRateService} from "../exchange-rate.service";

@Component({
    selector: 'app-client-dashboard-header',
    templateUrl: './client-dashboard-header.component.html',
    styleUrls: ['./client-dashboard-header.component.scss']
})
export class ClientDashboardHeaderComponent implements OnInit {

    needToBuy = 0
    boughtTotal: number
    headerPeriod: Period
    marketPricesReview: Array<MarketPriceRow>
    clientPricesReview: Array<MarketPriceRow>
    walletId: string

    // Charts stuff, should be refactored into separate component
    labelValuesMap = {}

    public lineChartData: Array<any> = [
        {data: [], label: 'Market price'},
        {data: [], label: 'Your price'}
    ];

    public lineChartLabels: Array<any>;

    public lineChartColors: Array<any> = [
      {
        borderWidth: 4,
        backgroundColor: '#001cff',
        borderColor: '#001cff',

        pointBackgroundColor: '#001cff',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointLabelFontSize: 10,

        pointRadius: 6,
        pointHoverRadius: 6,

        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#001cff',
      },
      {
        borderWidth: 4,
        backgroundColor: '#00a700',
        borderColor: '#00a700',

        pointBackgroundColor: '#00a700',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointLabelFontSize: 10,

        pointRadius: 6,
        pointHoverRadius: 6,

        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00a700'
      }
    ];

    public lineChartOptions: any = {
        hover: {
          mode: 'point'
        },
        layout: {
          padding: {
            left: 15,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        barPercentage: 0.5,
        responsive: true,
        maintainAspectRatio: false,
        legend: {display: false},
        tooltips: {
            enabled: false,
            custom: (tooltipModel) => {
                // Tooltip Element
                var tooltipEl = document.getElementById('chart-tooltip');

                // Create element on first render
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chart-tooltip';
                    document.body.appendChild(tooltipEl);
                }

                // Hide if no tooltip
                if (tooltipModel.opacity === 0) {
                    tooltipEl.style.display = 'none';
                    return;
                }

                // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltipModel.yAlign) {
                    tooltipEl.classList.add(tooltipModel.yAlign);
                } else {
                    tooltipEl.classList.add('no-transform');
                }

                const position = document.getElementById("plant-dashboard-chart").getBoundingClientRect();

                // Find Y Location on page

                let pointDown = true
                let top = 0

                if (tooltipModel.yAlign) {
                    if (tooltipModel.yAlign == 'top') {
                        // If div is aligned at top - we add some pixels, to push it down to back to canvas
                        top = tooltipModel.y + 5
                        pointDown = false
                    } else if (tooltipModel.yAlign == 'center') {
                        // Position over value
                        top = tooltipModel.y - 80
                        pointDown = true
                    } else if (tooltipModel.yAlign == 'bottom') {
                        // Position over value
                        top = tooltipModel.y - 52
                        pointDown = true
                    }
                }

                // Set Text
                if (tooltipModel.body) {
                    // Clears tooltip
                    while (tooltipEl.firstChild) {
                        tooltipEl.removeChild(tooltipEl.firstChild);
                    }

                    if (!pointDown) {
                        let innerPointerElement = document.createElement('div');
                        innerPointerElement.style.width = '0'
                        innerPointerElement.style.height = '0'
                        innerPointerElement.style.margin = 'auto'
                        innerPointerElement.style.position = 'relative'
                        innerPointerElement.style.bottom = '-13px'

                        innerPointerElement.style.borderLeft = '9px solid transparent'
                        innerPointerElement.style.borderRight = '9px solid transparent'
                        innerPointerElement.style.borderBottom = '9px solid #fff'

                        tooltipEl.appendChild(innerPointerElement);

                        let pointerElement = document.createElement('div');
                        pointerElement.style.width = '0'
                        pointerElement.style.height = '0'
                        pointerElement.style.margin = 'auto'

                        pointerElement.style.borderLeft = '10px solid transparent'
                        pointerElement.style.borderRight = '10px solid transparent'
                        pointerElement.style.borderBottom = '10px solid #e0e0e0'

                        tooltipEl.appendChild(pointerElement);
                    }

                    let bodyContainerEl = document.createElement('div');

                    bodyContainerEl.style.fontFamily = "'Roboto'";
                    bodyContainerEl.style.fontSize = '16px';
                    bodyContainerEl.style.padding = '10px 10px 10px 10px';
                    bodyContainerEl.style.backgroundColor = '#fff'
                    bodyContainerEl.style.borderColor = '#e0e0e0'
                    bodyContainerEl.style.borderStyle = 'solid'
                    bodyContainerEl.style.borderWidth = '3px'
                    bodyContainerEl.style.minWidth = '220px'

                    tooltipEl.appendChild(bodyContainerEl)

                    let titleLines = tooltipModel.title;

                    let titleElement = document.createElement('div');
                    titleElement.innerText = moment(this.labelValuesMap[titleLines[0]]).format('YYYY-MM-DD')
                    titleElement.style.display = 'table' // Allows centering horizontaly without known width
                    titleElement.style.margin = 'auto' // centers horizontaly

                    bodyContainerEl.appendChild(titleElement);

                    var bodyLines = tooltipModel.body.map(item => item.lines);

                    let bodyElement = document.createElement('div');
                    bodyElement.innerText = bodyLines[0] + ' EUR'
                    bodyElement.style.display = 'table' // Allows centering horizontaly without known width
                    bodyElement.style.margin = 'auto' // centers horizontaly
                    bodyContainerEl.appendChild(bodyElement);

                    if (pointDown) {
                        let pointerElement = document.createElement('div');
                        pointerElement.style.width = '0'
                        pointerElement.style.height = '0'
                        pointerElement.style.margin = 'auto'

                        pointerElement.style.borderLeft = '10px solid transparent'
                        pointerElement.style.borderRight = '10px solid transparent'
                        pointerElement.style.borderTop = '10px solid #e0e0e0'

                        tooltipEl.appendChild(pointerElement);

                        let innerPointerElement = document.createElement('div');
                        innerPointerElement.style.width = '0'
                        innerPointerElement.style.height = '0'
                        innerPointerElement.style.margin = 'auto'
                        innerPointerElement.style.position = 'relative'
                        innerPointerElement.style.top = '-13px'

                        innerPointerElement.style.borderLeft = '9px solid transparent'
                        innerPointerElement.style.borderRight = '9px solid transparent'
                        innerPointerElement.style.borderTop = '9px solid #fff'

                        tooltipEl.appendChild(innerPointerElement);
                    }
                }

                tooltipEl.style.display = 'inline';
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left = (position.left + tooltipModel.caretX - 110) + 'px';
                tooltipEl.style.top = position.top + top + 'px';
            }
        },
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                    fontFamily: "'Roboto', 'Sans-serif'",
                    fontSize: 16,
                    fontColor: '#000',

                    padding: 30
                },
                gridLines: {
                    color: '#e0e0e0',
                    lineWidth: 3,
                    drawBorder: false,

                    zeroLineColor: '#e0e0e0',
                    zeroLineWidth: 3,

                }
            }],
            xAxes: [{
                ticks: {
                    fontFamily: "'Roboto', 'Sans-serif'",
                    fontSize: 16,
                    fontColor: '#000',
                    padding: 10
                },
                categoryPercentage: 0.5,
                barPercentage: 0.6,
                gridLines: {
                    display: false
                }
            }]
        }
    };

    constructor(private predictionService: ConsumptionPredictionService,
                private ethereum: EthereumService,
                private exchangeRateService: ExchangeRateService,
                private electricityPriceService: ElectricityMarketPriceService,
                private tokensHandlerService: TokensHandlerService,
                private transactionLogs: TransactionsLogService
    ) {
    }

    ngOnInit() {
        this.tokensHandlerService.tokensChange.subscribe(
            tokens => {
                this.needToBuy = 0
                this.boughtTotal = 0
                this.loadRequirmentsForWeek(this.headerPeriod);
                this.loadTotalBought(this.headerPeriod)
            }
        );

        this.headerPeriod = new Period(
            moment().startOf('isoWeek').toDate(),
            moment().startOf('isoWeek').add(6, 'day').toDate()
        );

        this.ethereum.activeWallet()
            .subscribe(
                wallet => {
                    this.walletId = wallet
                    this.loadRequirmentsForWeek(this.headerPeriod);
                    this.loadTotalBought(this.headerPeriod)
                    this.loadMarketData()
                },
                error => console.error(error)
            )
    }


    private loadRequirmentsForWeek(reviewPeriod: Period) {
        this.predictionService.getPredictionTotal(this.walletId, reviewPeriod)
            .subscribe(
                predictions => this.needToBuy += predictions,
                error => console.error(error)
            );
    }

    private loadTotalBought(reviewPeriod: Period) {
        this.boughtTotal = 0
        let currentDate = moment(reviewPeriod.from).hours(0)

        while (currentDate.isSameOrBefore(moment(reviewPeriod.to))) {
            this.ethereum.getOwned(this.walletId, new Date(currentDate.format('YYYY-MM-DD')))
                .subscribe(bought => {
                        this.boughtTotal += Number(bought)
                        this.needToBuy -= Number(bought)
                    },
                    error => console.log)
            currentDate = currentDate.add(1, 'day')
        }
    }

    private loadMarketData() {
        let periodEnd = moment().add(1, 'day')
        let periodStart = periodEnd.clone().subtract(6, 'day')

        let marketReviewPeriod = new Period(
            periodStart.toDate(),
            periodEnd.toDate()
        );

        this.initChartLabels(marketReviewPeriod)

        // Expected to add prices from contracts, which will have to be merged.
        Promise.all(
            [
                this.electricityPriceService.getElectricityPrices(marketReviewPeriod).toPromise(),
                this.loadClientPrice(marketReviewPeriod).toPromise(),
                this.exchangeRateService.exchangeRate().toPromise()
            ]
        ).then(values => {
            let marketPrices = values[0]
            let clientPrices = values[1]
            let exchangeRate = values[2]

            this.setChartData(marketPrices, clientPrices, exchangeRate)
            // Prices from contract will have to be added later
            this.marketPricesReview = marketPrices
                .map(priceForDay => new MarketPriceRow(priceForDay[0], priceForDay[1], 25))
        }).catch(error => console.error(error))
    }

    private loadClientPrice(range: Period): Observable<Array<[Date, number]>> {

        const self_ = this
        const promises = []

        let from = moment(range.from)
        const to = moment(range.to)

        //TODO: refactor this to use one call for all info
        while (from.isSameOrBefore(to)) {
            promises.push(
                this.transactionLogs.transactionsConsumer(self_.walletId, from.toDate())
                    .mergeMap((data: Array<TransactionData>) =>
                        data.map(val => [val.date, val.amountEth / val.amountKwh]))
                    .toPromise())
                from = from.add(1, 'day')
        }
        return Observable.fromPromise(Promise.all(promises))
    }

    private initChartLabels(chartPeriod : Period) {
        let dayLabels: Array<string> = []

        let fromDate = chartPeriod.from;

        while (moment(fromDate).isSameOrBefore(chartPeriod.to)) {
            dayLabels.push(moment(fromDate).format('MM-DD'))
            this.labelValuesMap[moment(fromDate).format('MM-DD')] = fromDate

            fromDate = moment(fromDate).add(1, 'day').toDate()
        }

        this.lineChartLabels = dayLabels;
    }

    public setChartData(marketPrices: Array<[Date, number]>, clientPrices: Array<[Date, number]>, exchangeRate: number): void {
        let _lineChartData: Array<any> = new Array(this.lineChartData.length);

        _lineChartData[0] = {data: new Array(7), label: 'Market price'};

        for (let j = 0; j < marketPrices.length; j++) {
            _lineChartData[0].data[j] = marketPrices[j][1];
        }

        _lineChartData[1] = {data: new Array(7), label: 'Your price'}
        for (let j = 0; j < clientPrices.length; j++) {
            if (clientPrices[j]) {
                _lineChartData[1].data[j] = this.round(clientPrices[j][1] * exchangeRate, 6);
            }
        }

        let allPlotedPrices = _lineChartData[0].data

        let max = allPlotedPrices.reduce((max, n) => n > max ? n : max)
        let min = allPlotedPrices.reduce((min, n) => n < min ? n : min)

        let amplitude = max - min
        let lowestPoint = Math.max((min - amplitude), 0)
        let highestPoint = Math.max((max + amplitude/10), 0)

        this.lineChartOptions.scales.yAxes[0].ticks.suggestedMin = lowestPoint
        this.lineChartOptions.scales.yAxes[0].ticks.suggestedMax = highestPoint

        // Reseting labels is required in order to reset scales, as this resets min/max values
        this.lineChartLabels = Object.keys(this.labelValuesMap)

        setTimeout(() => {
            // Timeout required because of angular and chart js integration bug.
            this.lineChartData = _lineChartData;
        }, 50);
    }

    private round(number: number, precision: number) {
        const factor = Math.pow(10, precision)
        const roundedTempNumber = Math.round(number * factor)
        return roundedTempNumber / factor
    }
}
