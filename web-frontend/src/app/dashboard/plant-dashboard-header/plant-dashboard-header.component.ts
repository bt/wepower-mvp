import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { Period } from "../../shared/period";
import { MarketPriceRow } from "../market-price-row";
import { ProductionPredictionService } from "../../registration/prediction/production-prediction.service";
import { EthereumService } from "../../shared/ethereum.service";
import { ElectricityMarketPriceService } from "../electricity-market-price.service";

@Component({
  selector: 'app-plant-dashboard-header',
  templateUrl: './plant-dashboard-header.component.html',
  styleUrls: ['./plant-dashboard-header.component.scss']
})
export class PlantDashboardHeaderComponent implements OnInit {

  producedTotal : number
  headerPeriod : Period
  walletId : string

  public lineChartData:Array<any> = [
    {data: [], label: 'Market price'},
    {data: [], label: 'Your price'}
  ];

  public lineChartLabels:Array<any>;

  public lineChartColors:Array<any> = [
    {
      borderColor: '#001cff',
      backgroundColor: 'rgba(0,0,0,0)'
    },
    {
      borderColor: '#00a700',
      backgroundColor: 'rgba(0,0,0,0)'
    }
  ];

    public lineChartOptions:any = {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
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

  constructor(private predictionService : ProductionPredictionService,
              private ethereum : EthereumService,
              private electricityPriceService : ElectricityMarketPriceService) { }

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

  private loadData() {
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
    this.lineChartLabels = dayLabels;

    this.loadTotalPrediction(this.headerPeriod);
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
    Promise.all(
      [
        this.electricityPriceService.getElectricityPrices(marketReviewPeriod).toPromise()
      ]
    ).then(values => {
      this.setChartData(values[0])
      // let upadatedData = [
      //   {data: [], label: 'Market price'},
      //   {data: [28, 48, 40, 19, 86, 27, 90], label: 'Your price'}
      // ]
      // // Prices from contract will have to be added later
      // upadatedData[1].data = marketPrices
      //   .map(priceForDay => {
      //     return priceForDay[1]
      //   })
      // this.lineChartData = upadatedData
    }).catch(error => console.error(error))
  }

  private loadTotalPrediction(reviewPeriod : Period) {
    this.predictionService.getPredictionTotal(this.walletId, reviewPeriod)
      .subscribe(
        predictions => this.producedTotal = predictions,
        error => console.error(error)
      );
  }

  public setChartData(marketPrices : Array<[Date, number]>):void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);

    _lineChartData[0] = {data: new Array(7), label: 'Market price'};
    _lineChartData[1] = {data: new Array(7), label: 'Your price'};
    for (let j = 0; j < marketPrices.length; j++) {
      _lineChartData[0].data[j] = marketPrices[j][1];
    }
    setTimeout(() => {
      // Timeout required because of angular and chart js integration bug.
      this.lineChartData = _lineChartData;
    }, 50);
  }
}
