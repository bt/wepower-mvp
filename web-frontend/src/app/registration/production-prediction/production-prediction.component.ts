import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import { PredictionData } from "../prediction-review/prediction-data";
import { Period } from "../../shared/period";
import { ProductionPredictionService } from "../prediction/production-prediction.service";
import { EthereumService } from "../../shared/ethereum.service";

@Component({
  selector: 'app-production-prediction',
  templateUrl: './production-prediction.component.html',
  styleUrls: ['./production-prediction.component.css']
})
export class ProductionPredictionComponent implements OnInit {

  private productionData : Array<PredictionData>;
  private reviewPeriod : Period;

  constructor(private predictionService : ProductionPredictionService,
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
    this.predictionService.getPredictionData(this.ethereumService.activeWallet(), reviewPeriod)
      .subscribe(
        predictions => this.productionData = predictions,
        error => console.log(error)
      );
  }

  periodChanged(event : Period) {
    this.loadPrediction(event);
  }
}
