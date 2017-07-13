import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerDashboardComponent } from './consumer-dashboard/consumer-dashboard.component';
import { PlantDashboardComponent } from './plant-dashboard/plant-dashboard.component';
import {ExchangeRateService} from "./exchange-rate.service";
import {ProductionReviewService} from "./production-review.service";
import {ConsumptionReviewService} from "./consumption-review.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ConsumerDashboardComponent,
    PlantDashboardComponent
  ],
  providers: [
    ExchangeRateService,
    ProductionReviewService,
    ConsumptionReviewService
  ]
})
export class DashboardModule { }
