import { Component, OnInit } from '@angular/core';
import {PredictionData} from "../prediction-review/prediction-data";
import {Period} from "../../shared/period";
import {ConsumptionPredictionService} from "../prediction/consumption-prediction.service";
import {EthereumService} from "../../shared/ethereum.service";

@Component({
  selector: 'app-consumption-prediction',
  templateUrl: './consumption-prediction.component.html',
  styleUrls: ['./consumption-prediction.component.css']
})
export class ConsumptionPredictionComponent implements OnInit {

  private consumptionData : Array<PredictionData>;
  private reviewPeriod : Period;

  constructor(private predictionService : ConsumptionPredictionService,
              private ethereumService : EthereumService) { }

  ngOnInit() {
    this.reviewPeriod = new Period(
      new Date(),
      new Date(new Date().getTime() + 7 * 24 * 3600 * 1000)
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
