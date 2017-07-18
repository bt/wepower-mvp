import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import { PredictionData } from "../prediction-review/prediction-data";
import { Period } from "../../shared/period";
import { ConsumptionPredictionService } from "../prediction/consumption-prediction.service";
import { EthereumService } from "../../shared/ethereum.service";

@Component({
  selector: 'app-consumption-prediction',
  templateUrl: './consumption-prediction.component.html',
  styleUrls: ['./consumption-prediction.component.css']
})
export class ConsumptionPredictionComponent implements OnInit {

  public consumptionData : Array<PredictionData>;
  public reviewPeriod : Period;

  constructor(private predictionService : ConsumptionPredictionService,
              private ethereumService : EthereumService) { }

  ngOnInit() {
    let periodStart = moment().startOf('week').add(1, 'days')

    this.reviewPeriod = new Period(
      periodStart.toDate(),
      periodStart.clone().add(6, 'day').toDate()
    );

    this.loadPrediction(this.reviewPeriod);
  }

  private loadPrediction(reviewPeriod : Period) {
    console.log(reviewPeriod);
    this.predictionService.getPrediction(this.ethereumService.activeWallet(), reviewPeriod)
      .subscribe(
        predictions => this.consumptionData = predictions,
        error => console.log(error)
      );
  }

  periodChanged(event : Period) {
    this.loadPrediction(event);
  }
}
