import {Component, OnInit} from '@angular/core';

import * as moment from 'moment';
import {Period} from "../../shared/period";
import {MarketPriceRow} from "../market-price-row";
import {ConsumptionPredictionService} from "../../registration/prediction/consumption-prediction.service";
import {EthereumService} from "../../shared/ethereum.service";
import {ElectricityMarketPriceService} from "../electricity-market-price.service";

@Component({
    selector: 'app-client-dashboard-header',
    templateUrl: './client-dashboard-header.component.html',
    styleUrls: ['./client-dashboard-header.component.scss']
})
export class ClientDashboardHeaderComponent implements OnInit {

    consumedTotal: number
    boughtTotal: number
    headerPeriod: Period
    marketPricesReview: Array<MarketPriceRow>
    walletId: string

    public lineChartData: Array<any> = [
        {data: [], label: 'Market price'},
        {data: [], label: 'Your price'}
    ];

    public lineChartLabels: Array<any>;

    public lineChartColors: Array<any> = [
        {
            borderColor: '#001cff',
            backgroundColor: 'rgba(0,0,0,0)'
        },
        {
            borderColor: '#00a700',
            backgroundColor: 'rgba(0,0,0,0)'
        }
    ];

    public lineChartOptions: any = {
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
                    } else {
                        // Position over value
                        top = tooltipModel.y - 75
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
                    bodyContainerEl.style.minWidth = '120px'

                    tooltipEl.appendChild(bodyContainerEl)

                    let titleLines = tooltipModel.title;

                    let titleElement = document.createElement('div');
                    titleElement.innerText = moment(this.lineChartLabels[titleLines[0]]).format('YYYY-MM-DD')
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
                tooltipEl.style.left = (position.left + tooltipModel.caretX - 82) + 'px';
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
                gridLines: {
                    display: false
                }
            }]
        }
    };

    constructor(private predictionService: ConsumptionPredictionService,
                private ethereum: EthereumService,
                private electricityPriceService: ElectricityMarketPriceService) {
    }

    ngOnInit() {

        this.headerPeriod = new Period(
            moment().subtract(5, 'day').toDate(),
            moment().add(1, 'day').toDate());

        let dayLabels: Array<string> = []

        let date = this.headerPeriod.from;
        while (moment(date).isBefore(this.headerPeriod.to)) {
            dayLabels.push(moment(date).format('MM-DD'))
            date = moment(date).add(1, 'day').toDate()
        }
        this.lineChartLabels = dayLabels;

        this.ethereum.activeWallet()
            .subscribe(
                wallet => {
                    this.walletId = wallet
                    this.loadTotalPrediction(this.headerPeriod);
                    this.loadTotalBought(this.headerPeriod)
                    this.loadMarketData()
                },
                error => console.error(error)
            )
    }

    private loadTotalPrediction(reviewPeriod: Period) {
        this.predictionService.getPredictionTotal(this.walletId, reviewPeriod)
            .subscribe(
                predictions => this.consumedTotal = predictions,
                error => console.error(error)
            );

    }

    private loadTotalBought(reviewPeriod: Period) {
        this.boughtTotal = 0
        let currentDate = moment(reviewPeriod.from).hours(0)

        while (currentDate.isSameOrBefore(moment(reviewPeriod.to))) {
            this.ethereum.getOwned(this.walletId, new Date(currentDate.format('YYYY-MM-DD')))
                .subscribe(data => this.boughtTotal += Number(data),
                    error => console.log)
            currentDate = currentDate.add(1, 'day')
        }
    }

    private loadMarketData() {
        let periodEnd = moment().add(1, 'days')
        let periodStart = periodEnd.clone().subtract(6, 'day')

        let marketReviewPeriod = new Period(
            periodStart.toDate(),
            periodEnd.toDate()
        );

        // Expected to add prices from contracts, which will have to be merged.
        Promise.all(
            [
                this.electricityPriceService.getElectricityPrices(marketReviewPeriod).toPromise()
            ]
        ).then(values => {
            let marketPrices = values[0]

            this.setChartData(marketPrices)
            // Prices from contract will have to be added later
            this.marketPricesReview = marketPrices
                .map(priceForDay => new MarketPriceRow(priceForDay[0], priceForDay[1], 25))
        }).catch(error => console.error(error))
    }

    public setChartData(marketPrices: Array<[Date, number]>): void {
        let _lineChartData: Array<any> = new Array(this.lineChartData.length);

        _lineChartData[0] = {data: new Array(7), label: 'Market price'};
        for (let j = 0; j < marketPrices.length; j++) {
            _lineChartData[0].data[j] = marketPrices[j][1];
        }

        _lineChartData[1] = {data: new Array(7), label: 'Your price'};

        setTimeout(() => {
            // Timeout required because of angular and chart js integration bug.
            this.lineChartData = _lineChartData;
        }, 50);
    }

}
