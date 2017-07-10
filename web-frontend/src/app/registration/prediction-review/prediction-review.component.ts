import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { PredictionData } from "./prediction-data";
import { Period } from "../../shared/period";

@Component({
  selector: 'app-prediction-review',
  templateUrl: './prediction-review.component.html',
  styleUrls: ['./prediction-review.component.css']
})
export class PredictionReviewComponent implements OnInit {

  @Input('prediction') reviewData : Array<PredictionData>;
  @Input('period') visiblePeriod : Period;

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
}
