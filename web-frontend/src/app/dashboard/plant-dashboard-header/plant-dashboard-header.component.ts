import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { Period } from "../../shared/period";
import { ProductionPredictionService } from "../../registration/prediction/production-prediction.service";
import { EthereumService } from "../../shared/ethereum.service";
import { ElectricityMarketPriceService } from "../electricity-market-price.service";
import {PriceLogService} from "../../shared/price-log-service";
import {ExchangeRateService} from "app/dashboard/exchange-rate.service";
import {PriceService} from "../price.service";

@Component({
  selector: 'app-plant-dashboard-header',
  templateUrl: './plant-dashboard-header.component.html',
  styleUrls: ['./plant-dashboard-header.component.scss']
})
export class PlantDashboardHeaderComponent implements OnInit {

  producedTotal: number
  soldTotal: number
  headerPeriod: Period
  walletId: string
  price = 0
  priceEth = 0
  loading = false
  invalidPrice = false

  priceChange: any

  // Charts stuff, should be refactored into separate component
  labelValuesMap = {}

  public lineChartData: Array<any> = [
    {data: [], label: 'Market price', pointHitRadius: 1},
    {data: [], label: 'Your price', pointHitRadius: 1}
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
      pointHitRadius: 1,

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

        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: {
            enabled: false,
            yAlign: 'bottom',
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

                const bodyRect = document.body.getBoundingClientRect()
                const elemRect = document.getElementById("plant-dashboard-chart").getBoundingClientRect()
                const offset   = elemRect.top - bodyRect.top;

                const position = {top: offset, left: elemRect.left}

                // Find Y Location on page

                let top = tooltipModel.y - 40

                // Set Text
                if (tooltipModel.body) {
                    // Clears tooltip
                    while (tooltipEl.firstChild) {
                        tooltipEl.removeChild(tooltipEl.firstChild);
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
                    fontFamily: "'Roboto', 'Sans-serif'",
                    fontSize: 16,
                    fontColor: '#000',

                    padding: 30,

                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                      return Math.round(value * 100) / 100;
                    }

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
                    display:false
                }
            }]
        }
    };

  constructor(private predictionService: ProductionPredictionService,
              private ethereum: EthereumService,
              private electricityPriceService: ElectricityMarketPriceService,
              private priceLog: PriceLogService,
              private exchangeRateService: ExchangeRateService,
              private priceService: PriceService) {

  }

  ngOnInit() {
  this.priceChange = this.priceService.priceChange.subscribe((price) => {
      this.price = price
      this.handlePrice(null)
      this.loadData()
  });
    this.ethereum.activeWallet()
      .subscribe(
        wallet => {
          this.walletId = wallet
          this.priceService.loadPrice(this.walletId).subscribe(
              data => {},
              error => console.error(error)
          )
        },
        error => console.error(error)
      )
  }

    ngOnDestroy() {
        this.priceChange.unsubscribe();
    }

  setPrice(): void {
      const self_ = this
      this.loading = true

      if (Number.isNaN(Number.parseFloat(this.price.toString())) || this.price < 0) {
          this.priceService.loadPrice(this.walletId)
          this.loading = false
          return
      }

      this.priceService.changePrice(this.walletId, this.price)
          .subscribe(
              result => self_.loading = false,
              error => self_.loading = false)
      /*self_.priceEth = self_.round(self_.price / Number(data), 6)*/
  }

    handlePrice(event: any): void {
        const self_ = this
        this.priceEth = 0

        this.exchangeRateService.exchangeRate()
            .subscribe(
                rate => self_.priceEth = self_.priceService.round(self_.price / rate, 6),
                error => {
                    console.log(error)
                    self_.priceEth = 0
                }
            )
    }

  private loadData() {
    this.headerPeriod = new Period(
      moment().startOf('isoWeek').toDate(),
      moment().startOf('isoWeek').add(6, 'day').toDate()
    );

    this.loadTotalPrediction(this.headerPeriod)
    this.loadTotalSold(this.headerPeriod)
    this.loadMarketReview();
  }

  private loadMarketReview() {
    let marketReviewEnd = moment().add(1, 'day')
    let marketReviewStart = marketReviewEnd.clone().subtract(6, 'day')

    let marketReviewPeriod = new Period(
      marketReviewStart.toDate(),
      marketReviewEnd.toDate()
    );

    this.initChartLabels(marketReviewPeriod)

    // Expected to add prices from contracts, which will have to be merged.
    Promise.all([
        this.electricityPriceService.getElectricityPrices(marketReviewPeriod).toPromise(),
        this.priceLog.getForPeriod(this.walletId, marketReviewPeriod).toPromise()
    ])
        .then(values => this.setChartData(values[0], values[1]))
        .catch(error => console.error(error))
  }

  private loadTotalPrediction(reviewPeriod: Period) {
    this.predictionService.getPredictionTotal(this.walletId, reviewPeriod)
      .subscribe(
        predictions => this.producedTotal = predictions,
        error => console.error(error)
      );
  }

  private loadTotalSold(reveiwPeriod: Period) {
      this.soldTotal = 0
      let currentDate = moment(reveiwPeriod.from)

      while (currentDate.isSameOrBefore(moment(reveiwPeriod.to))) {
          const date = new Date(currentDate.format('YYYY-MM-DD'))
          Promise.all([
              this.ethereum.getTotalAmount(this.walletId, date).toPromise(),
              this.ethereum.getOwned(this.walletId, date).toPromise()
          ]).then(values => {
            this.soldTotal += (Number(values[0]) - Number(values[1]))
          })
          currentDate = currentDate.add(1, 'day')
      }
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

  public setChartData(marketPrices: Array<[Date, number]>, yourPrices: Array<[Date, number]>): void {
    let _lineChartData: Array<any> = new Array(this.lineChartData.length);

    _lineChartData[0] = {data: new Array(7), label: 'Market price'};
    for (let j = 0; j < marketPrices.length; j++) {
      _lineChartData[0].data[j] = marketPrices[j][1];
    }

     _lineChartData[1] = {data: new Array(7), label: 'Your price'};
      for (let j = 0; j < yourPrices.length; j++) {
          _lineChartData[1].data[j] = yourPrices[j][1];
      }

    let allPlotedPrices = _lineChartData[0].data.concat(_lineChartData[1].data)

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
      this.lineChartData = _lineChartData

    }, 50);
  }
}
