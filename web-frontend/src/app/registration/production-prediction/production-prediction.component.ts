import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import * as moment from 'moment';

import { PredictionData } from "../prediction-review/prediction-data";
import { Period } from "../../shared/period";
import { ProductionPredictionService } from "../prediction/production-prediction.service";
import { EthereumService } from "../../shared/ethereum.service";
import { PlantManagementService } from "../plant-management.service";

@Component({
  selector: 'app-production-prediction',
  templateUrl: './production-prediction.component.html',
  styleUrls: ['./production-prediction.component.scss']
})
export class ProductionPredictionComponent implements OnInit {

  public productionData : Array<PredictionData>;
  public reviewPeriod : Period;

  constructor(private plantService: PlantManagementService,
              private predictionService : ProductionPredictionService,
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
    this.predictionService.getPredictionData(this.ethereumService.activeWallet(), reviewPeriod)
      .subscribe(
        predictions => this.productionData = predictions,
        error => console.error(error)
      );
  }

  periodChanged(event : Period) {
    this.loadPrediction(event);
  }

  activatePlant() {
    this.plantService.activatePlant(this.ethereumService.activeWallet())
      .subscribe(
        success => this.router.navigateByUrl('/dashboard/plant'),
        error => console.error(error)
      );
  }
}
