import { Component, OnInit } from '@angular/core';
import {PredictionData} from "../prediction-review/prediction-data";
import {Period} from "../../shared/period";
import {ProductionPredictionService} from "../prediction/production-prediction.service";
import {EthereumService} from "../../shared/ethereum.service";

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
    const millisInWeek = 7 * 24 * 3600 * 1000;

    this.reviewPeriod = new Period(
      new Date(),
      new Date(new Date().getTime() + millisInWeek)
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
