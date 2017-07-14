import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerDashboardComponent } from './consumer-dashboard/consumer-dashboard.component';
import { PlantDashboardComponent } from './plant-dashboard/plant-dashboard.component';
import {ExchangeRateService} from "./exchange-rate.service";
import {ProductionReviewService} from "./production-review.service";
import {ConsumptionReviewService} from "./consumption-review.service";
import { ElectricityMarketPriceService } from "./electricity-market-price.service";
import { WalletBalanceComponent } from './wallet-balance/wallet-balance.component';
import { PlantDashboardHeaderComponent } from './plant-dashboard-header/plant-dashboard-header.component';
import { ClientDashboardHeaderComponent } from './client-dashboard-header/client-dashboard-header.component';
import { ClientConsumptionReviewComponent } from './client-consumption-review/client-consumption-review.component';
import { PlantProductionReviewComponent } from './plant-production-review/plant-production-review.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ConsumerDashboardComponent,
    PlantDashboardComponent,
    WalletBalanceComponent,
    PlantDashboardHeaderComponent,
    ClientDashboardHeaderComponent,
    ClientConsumptionReviewComponent,
    PlantProductionReviewComponent
  ],
  providers: [
    ExchangeRateService,
    ProductionReviewService,
    ConsumptionReviewService,
    ElectricityMarketPriceService
  ]
})
export class DashboardModule { }
