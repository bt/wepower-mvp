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


  backDisabled : boolean
  frontDisabled : boolean

  @Input('period')
  visiblePeriod : Period;

  _reviewData : Array<PredictionData>
  _availableRange : Period;

  @Output() onVisiblePeriodChanged = new EventEmitter<Period>()

  // Charts stuff, should be refactored into separate component
  labelValuesMap = {}

  // Default value is required to initialise empty chart on page load.
  public lineChartData:Array<any> = [{data:[]}]
  public lineChartLabels:Array<any> = []

  public lineChartOptions:any = {
    responsive: false,

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

        const position = document.getElementById("prediction-chart").getBoundingClientRect();

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

            innerPointerElement.style.borderLeft = '8px solid transparent'
            innerPointerElement.style.borderRight = '8px solid transparent'
            innerPointerElement.style.borderBottom = '8px solid #fff'

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
          titleElement.innerText = moment(this.labelValuesMap[titleLines[0]]).format('YYYY-MM-DD')
          titleElement.style.display = 'table' // Allows centering horizontaly without known width
          titleElement.style.margin = 'auto' // centers horizontaly

          bodyContainerEl.appendChild(titleElement);

          var bodyLines = tooltipModel.body.map(item => item.lines);

          let bodyElement = document.createElement('div');
          bodyElement.innerText = bodyLines[0] + 'kWh'
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

            innerPointerElement.style.borderLeft = '8px solid transparent'
            innerPointerElement.style.borderRight = '8px solid transparent'
            innerPointerElement.style.borderTop = '8px solid #fff'

            tooltipEl.appendChild(innerPointerElement);
          }
        }

        tooltipEl.style.display = 'inline';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = (position.left + tooltipModel.caretX - 60) + 'px';
        tooltipEl.style.top = position.top + top + 'px';
      }
    },
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
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
    this.adjustButtonActivity()
  }

  previousPeriod() {
    this.visiblePeriod = this.visiblePeriod.plusWeeks(-1);
    this.onVisiblePeriodChanged.emit(this.visiblePeriod);
    this.adjustButtonActivity()
  }

  private adjustButtonActivity() {
    if (this.visiblePeriod == null || this.availableRange) {
      this.backDisabled = true
      this.frontDisabled = true
    }

    this.backDisabled = false
    if (this.visiblePeriod.from <= this.availableRange.from) {
      this.backDisabled = true
    }

    this.frontDisabled = false
    if (this.visiblePeriod.to >= this.availableRange.to) {
      this.frontDisabled = true
    }
  }

  @Input('availableRange')
  set availableRange(availableRange: Period) {
    if (!availableRange) {
      return
    }

    this._availableRange = availableRange
    this.adjustButtonActivity()
  }

  get availableRange() : Period {
    return this._availableRange
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

    // Null predictions ensure that chart would display value sequence correctly,
    // however nulls are not plotted
    let predictions = data.map(prediction => prediction.energyPrediction)
      .map(prediction => prediction == 0 ? null : prediction)

    let presentPredictions = predictions.filter(value => value != null)

    let max = presentPredictions.reduce((max, n) => n > max ? n : max)
    let min = presentPredictions.reduce((min, n) => n < min ? n : min)

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
