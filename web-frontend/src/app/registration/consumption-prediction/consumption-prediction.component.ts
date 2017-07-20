import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

import { PredictionData } from "../prediction-review/prediction-data";
import { Period } from "../../shared/period";
import { ConsumptionPredictionService } from "../prediction/consumption-prediction.service";
import { EthereumService } from "../../shared/ethereum.service";
import { ConsumerManagementService } from "../consumer-management.service";

@Component({
  selector: 'app-consumption-prediction',
  templateUrl: './consumption-prediction.component.html',
  styleUrls: ['./consumption-prediction.component.scss']
})
export class ConsumptionPredictionComponent implements OnInit {

  public consumptionData : Array<PredictionData>;
  public reviewPeriod : Period;

  constructor(private consumerService : ConsumerManagementService,
              private predictionService : ConsumptionPredictionService,
              private ethereumService : EthereumService,
              private router: Router) { }

  ngOnInit() {
    let periodStart = moment().startOf('week').add(1, 'days')

    this.reviewPeriod = new Period(
      periodStart.toDate(),
      periodStart.clone().add(6, 'day').toDate()
    );

    this.loadPrediction(this.reviewPeriod);
  }

  private loadPrediction(reviewPeriod : Period) {
    this.predictionService.getPrediction(this.ethereumService.activeWallet(), reviewPeriod)
      .subscribe(
        predictions => this.consumptionData = predictions,
        error => console.error(error)
      );
  }

  periodChanged(event : Period) {
    this.loadPrediction(event);
  }

  activateConsumer() {
    this.consumerService.activateConsumer(this.ethereumService.activeWallet())
      .subscribe(
        success => this.router.navigateByUrl('/dashboard/consumer'),
        error => console.error(error)
      );
  }
}
