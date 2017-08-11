import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { Period } from "../../shared/period";
import { MarketPriceRow } from "../market-price-row";
import { ProductionPredictionService } from "../../registration/prediction/production-prediction.service";
import { EthereumService } from "../../shared/ethereum.service";
import { ElectricityMarketPriceService } from "../electricity-market-price.service";
import {BlockchainPlantData} from "../../shared/blockchain-plant";
import {PriceLogService} from "../../shared/price-log-service";
import {ExchangeRateService} from "app/dashboard/exchange-rate.service";

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
        legend: { display: false },
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
              private pricesLog: PriceLogService) { }

  ngOnInit() {
    this.ethereum.activeWallet()
      .subscribe(
        wallet => {
          this.walletId = wallet
          this.loadData()
        },
        error => console.error(error)
      )
  }

  setPrice(): void {
      const self_ = this
      this.loading = true
      this.exchangeRateService.exchangeRate()
          .mergeMap((data) => {
              self_.priceEth = self_.round(self_.price / Number(data), 6)
              return self_.ethereum.setPrice(self_.walletId, self_.ethereum.ethToWei(self_.priceEth))
          })
          .mergeMap(data => self_.priceLog.log(self_.walletId, self_.price))
          .subscribe(
          data => {
              self_.loadPrice()
              this.loading = false
          },
          error => {
              console.log(error)
              self_.loadPrice()
              this.loading = false
          }
      )
  }

    calcPriceInEth(): void {
        const self_ = this

        this.priceEth = 0
        this.exchangeRateService.exchangeRate()
            .subscribe(
                data => self_.priceEth = self_.round(self_.price / data, 6),
                error => {
                    console.log(error)
                    self_.priceEth = 0
                }
            )
    }

  private loadData() {

    this.loadPrice()

    this.headerPeriod = new Period(
      moment().startOf('isoWeek').toDate(),
      moment().startOf('isoWeek').add(6, 'day').toDate()
    );

    let dayLabels: Array<string> = []

    let date = this.headerPeriod.from;
    while (moment(date).isBefore(this.headerPeriod.to)) {
        dayLabels.push(moment(date).format('MM-DD'))
        date = moment(date).add(1, 'day').toDate()
    }
    this.lineChartLabels = dayLabels

    this.loadTotalPrediction(this.headerPeriod)
    this.loadTotalSold(this.headerPeriod)
    this.loadMarketReview();
  }

  private loadMarketReview() {
    let marketReviewEnd = moment().add(1, 'days')
    let marketReviewStart = marketReviewEnd.clone().subtract(6, 'day')

    let marketReviewPeriod = new Period(
      marketReviewStart.toDate(),
      marketReviewEnd.toDate()
    );

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
          Promise.all([
              this.ethereum.getTotalAmount(this.walletId, currentDate.toDate()).toPromise(),
              this.ethereum.getOwned(this.walletId, currentDate.toDate()).toPromise()
          ]).then(values => {
            this.soldTotal += (Number(values[0]) - Number(values[1]))
          })
          currentDate = currentDate.add(1, 'day')
      }
  }

  private loadPrice() {
      this.ethereum.getPrice(this.walletId).subscribe(
          data => {
              this.price = this.ethereum.weiToETH(data)
              this.calcPriceInEth()},
              error => console.error(error)
      )
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

    setTimeout(() => {
      // Timeout required because of angular and chart js integration bug.
      this.lineChartData = _lineChartData;
    }, 50);
  }


    private round(number: number, precision: number) {
        var factor = Math.pow(10, precision);
        var tempNumber = number * factor;
        var roundedTempNumber = Math.round(tempNumber);
        return roundedTempNumber / factor;
    };
}
