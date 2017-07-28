import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { LandingComponent } from "./landing/landing.component";
import { PlantFormComponent } from "./registration/plant-form/plant-form.component";
import { ConsumerFormComponent } from "./registration/consumer-form/consumer-form.component";
import { ProductionPredictionComponent } from "./registration/production-prediction/production-prediction.component";
import { ConsumptionPredictionComponent } from "./registration/consumption-prediction/consumption-prediction.component";
import { ConsumerDashboardComponent } from "./dashboard/consumer-dashboard/consumer-dashboard.component";
import { PlantDashboardComponent } from "./dashboard/plant-dashboard/plant-dashboard.component";
import { RegistrationLayoutComponent } from "./registration/registration-layout/registration-layout.component";
import { DashboardLayoutComponent } from "./dashboard/dashboard-layout/dashboard-layout.component";
import { PlantDashboardGuardService } from "./dashboard/router-guards/plant-dashboard-guard.service";
import { ConsumerDashboardGuardService } from "./dashboard/router-guards/consumer-dashboard-guard.service";
import { ExistingUserGuardService } from "./landing/router-guards/existing-user-guard.service";

const appRoutes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent, pathMatch: 'full', canActivate: [ExistingUserGuardService] },

  { path: 'register',
    children: [
      {
        path: '', component: RegistrationLayoutComponent, children: [
          { path: 'plant', component: PlantFormComponent, pathMatch: 'full', canActivate: [ExistingUserGuardService] },
          { path: 'plant/review', component: ProductionPredictionComponent, pathMatch: 'full', canActivate: [ExistingUserGuardService]},
          { path: 'consumer', component: ConsumerFormComponent, pathMatch: 'full', canActivate: [ExistingUserGuardService]},
          { path: 'consumer/review', component: ConsumptionPredictionComponent, pathMatch: 'full', canActivate: [ExistingUserGuardService]}
        ]
      }
    ]
  },
  { path: 'dashboard', children: [
      {
        path: '', component: DashboardLayoutComponent, children: [
          { path: 'plant', component: PlantDashboardComponent, pathMatch: 'full', canActivate: [PlantDashboardGuardService] },
          { path: 'consumer', component: ConsumerDashboardComponent, pathMatch: 'full', canActivate: [ConsumerDashboardGuardService] }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
