import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { PredictionData } from "./prediction-data"
import { Period } from "../../shared/period"
import { DataFiller } from "../../shared/data-filler.service";

@Component({
  selector: 'app-prediction-review',
  templateUrl: './prediction-review.component.html',
  styleUrls: ['./prediction-review.component.scss']
})
export class PredictionReviewComponent implements OnInit {

  _reviewData : Array<PredictionData>;

  @Input('period')
  visiblePeriod : Period;

  @Output() onVisiblePeriodChanged = new EventEmitter<Period>();


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
  }

  get reviewData() : Array<PredictionData> {
    return this._reviewData
  }
}
