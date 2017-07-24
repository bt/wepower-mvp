import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'

import * as moment from 'moment'
import { PredictionData } from "./prediction-data"
import { Period } from "../../shared/period"
import { DataFiller } from "../../shared/data-filler.service"


@Component({
  selector: 'app-prediction-review',
  templateUrl: './prediction-review.component.html',
  styleUrls: ['./prediction-review.component.scss'],
})
export class PredictionReviewComponent implements OnInit {

  _reviewData : Array<PredictionData>
  labelValuesMap = {}

  @Input('period')
  visiblePeriod : Period;

  @Output() onVisiblePeriodChanged = new EventEmitter<Period>()
  //
  // @ViewChild(ChartComponent) chartComp;
  // let chart = this.chartComp.chart;

  // Default value is required to initialise empty chart on page load.
  public lineChartData:Array<any> = [{data:[]}]
  public lineChartLabels:Array<any> = []

  public lineChartOptions:any = {
    responsive: true,
    legend: { display: false },
    tooltips: {
      enabled: false,
      custom: (tooltipModel) => {
        // Tooltip Element
        var tooltipEl = document.getElementById('chartjs-tooltip');

        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div');
          tooltipEl.id = 'chartjs-tooltip';
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


        // Set Text
        if (tooltipModel.body) {

          var titleLines = tooltipModel.title;
          var bodyLines = tooltipModel.body.map(item => item.lines);

          var innerHtml = '<thead>';
          innerHtml += '<tr><th>' + moment(this.labelValuesMap[titleLines[0]]).format('YYYY-MM-DD') + '</th></tr>';
          innerHtml += '</thead><tbody>';

          tooltipEl.innerHTML = innerHtml;
        }

        tooltipEl.style.fontFamily = "'Roboto'";
        tooltipEl.style.fontSize = '16px';
        tooltipEl.style.padding = '10px 10px 10px 10px';



        // `this` will be the overall tooltip
        // var position = this._chart.canvas.getBoundingClientRect();

        // Display, position, and set styles for font
        tooltipEl.style.display = 'inline';
        tooltipEl.style.position = 'aboslute';
        tooltipEl.style.left = 150 + tooltipModel.caretX + 'px';
        tooltipEl.style.top = 150 + tooltipModel.caretY + 'px';
      }
    },
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
          // suggestedMax: 30,
          fontFamily: "'Roboto', 'Sans-serif'",
          fontSize: 20,
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
          fontSize: 20,
          fontColor: '#000',
          padding: 10
        },
        gridLines: {
          display:false
        }
      }]
    }
  };

  public lineChartColors:Array<any> = [
    {
      borderWidth: 5,
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: '#001cff',

      pointBackgroundColor: '#001cff',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointLabelFontSize: 10,

      pointRadius: 7,
      pointHoverRadius: 7,

      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#001cff',
    }
  ];

  public lineChartType:string = 'line';


  constructor() { }

  ngOnInit() {

  }

  nextPeriod() {
    this.visiblePeriod = this.visiblePeriod.plusWeeks(1);
    this.onVisiblePeriodChanged.emit(this.visiblePeriod);
  }

  previousPeriod() {
    this.visiblePeriod = this.visiblePeriod.plusWeeks(-1);
    this.onVisiblePeriodChanged.emit(this.visiblePeriod);
  }

  @Input('prediction')
  set reviewData(prediction: Array<PredictionData>) {
    this._reviewData = (DataFiller.fillForWeek(prediction, PredictionData.emptyForDay) as Array<PredictionData>)
    this.plotPredictionData(this._reviewData)
  }

  get reviewData() : Array<PredictionData> {
    return this._reviewData
  }

  public plotPredictionData(data : Array<PredictionData>):void {

    if (data.length == 0) {
      return
    }

    data.map(prediction => prediction.date)
      .map(date => this.labelValuesMap[moment(date).format('MM-DD')] = date )

    let dayLabels = data.map(prediction => prediction.date)
      .map(date => moment(date).format('MM-DD'))

    let predictions = data.map(prediction => prediction.energyPrediction)
    let max = predictions.reduce((max, n) => n > max ? n : max)
    let min = predictions.reduce((min, n) => n < min ? n : min)

    let amplitude = max - min
    let lowestPoint = Math.floor(Math.max((min - amplitude), 0))

    let _lineChartData:Array<any> = [{data: predictions}]

    this.lineChartOptions.scales.yAxes[0].ticks.suggestedMin = lowestPoint
    this.lineChartLabels = dayLabels;
    setTimeout(() => {
      // Timeout required because of angular and chart js integration bug.
      this.lineChartData = _lineChartData;
    }, 50);
  }
}
