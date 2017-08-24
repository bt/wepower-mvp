import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ChartsModule } from 'ng2-charts';
import { AngularFontAwesomeModule } from "angular-font-awesome";


import { ConsumerDashboardComponent } from './consumer-dashboard/consumer-dashboard.component';
import { PlantDashboardComponent } from './plant-dashboard/plant-dashboard.component';
import { ExchangeRateService } from "./exchange-rate.service";
import { ProductionReviewService } from "./production-review.service";
import { ConsumptionReviewService } from "./consumption-review.service";
import { ElectricityMarketPriceService } from "./electricity-market-price.service";
import { WalletBalanceComponent } from './wallet-balance/wallet-balance.component';
import { PlantDashboardHeaderComponent } from './plant-dashboard-header/plant-dashboard-header.component';
import { ClientDashboardHeaderComponent } from './client-dashboard-header/client-dashboard-header.component';
import { ClientConsumptionReviewComponent } from './client-consumption-review/client-consumption-review.component';
import { PlantProductionReviewComponent } from './plant-production-review/plant-production-review.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { PlantDashboardGuardService } from "./router-guards/plant-dashboard-guard.service";
import { ConsumerDashboardGuardService } from "./router-guards/consumer-dashboard-guard.service";
import {NumberOnlyDirective} from "../shared/numbers-only-directive";
import {PriceService} from "./price.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AngularFontAwesomeModule,
    ChartsModule
  ],
  exports: [
    DashboardLayoutComponent
  ],
  declarations: [
    ConsumerDashboardComponent,
    PlantDashboardComponent,
    WalletBalanceComponent,
    PlantDashboardHeaderComponent,
    ClientDashboardHeaderComponent,
    ClientConsumptionReviewComponent,
    PlantProductionReviewComponent,
    DashboardLayoutComponent,
    NumberOnlyDirective
  ],
  providers: [
    ExchangeRateService,
    ProductionReviewService,
    ConsumptionReviewService,
    ElectricityMarketPriceService,
    PlantDashboardGuardService,
    ConsumerDashboardGuardService,
    PriceService
  ]
})
export class DashboardModule { }
