import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import "rxjs/add/operator/mergeMap";

import * as moment from 'moment';

import { PredictionData } from "../prediction/prediction-data";
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
  public predictionRange : Period
  public reviewPeriod : Period;
  public walletId : string
  public loading = false

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

    this.ethereumService.activeWallet()
      .subscribe(
        wallet => {
          this.walletId = wallet
          this.loadPrediction(this.reviewPeriod);
          this.loadAvailablePeriod()
        },
        error => console.error(error))
  }

  private loadPrediction(reviewPeriod : Period) {
    this.predictionService.getPredictionData(this.walletId, reviewPeriod)
      .subscribe(
        predictions => this.productionData = predictions,
        error => console.error(error)
      );
  }

  private loadAvailablePeriod() {
    this.predictionService.getPredictedPeriod(this.walletId)
      .subscribe(
        period => this.predictionRange = period,
        error => console.error(error)
      );
  }

  periodChanged(event : Period) {
    this.loadPrediction(event);
  }

  activatePlant() {
    this.loading = true
    this.plantService.activatePlant(this.walletId)
      .subscribe(
        success => {
            this.loading = false
            this.router.navigateByUrl('/dashboard/plant')
        },
       error => {
          this.loading = false
          console.error(error)
        }
      )
  }
}
