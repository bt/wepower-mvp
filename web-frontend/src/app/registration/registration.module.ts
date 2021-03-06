import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';
import { DatePipe } from '@angular/common';

import { PlantFormComponent } from './plant-form/plant-form.component';
import { ConsumerFormComponent } from './consumer-form/consumer-form.component';
import { AreaOptionsService } from "./area-options.service";
import { PlantManagementService } from "./plant-management.service";
import { HouseSizeOptionsService } from "./house-size-options.service";
import { ConsumerManagementService } from "./consumer-management.service";
import { PlantTypePipe } from './plant-type.pipe';
import { SharedModule } from "../shared/shared.module";
import { CUSTOM_VALIDATORS } from "../shared/custom.validators";
import { ConsumptionPredictionComponent } from './consumption-prediction/consumption-prediction.component';
import { ProductionPredictionComponent } from './production-prediction/production-prediction.component';
import { PredictionReviewComponent } from './prediction-review/prediction-review.component';
import { ProductionPredictionService } from "./prediction/production-prediction.service";
import { ConsumptionPredictionService } from "./prediction/consumption-prediction.service";
import { RegistrationLayoutComponent } from './registration-layout/registration-layout.component';
import { ChartsModule } from "ng2-charts";
import { MdAutocompleteModule, MdInputModule } from '@angular/material';
import {FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule,
    SharedModule,
    ChartsModule,
    MdAutocompleteModule,
    MdInputModule
  ],
  exports: [
    PlantFormComponent,
    ConsumerFormComponent,
    RegistrationLayoutComponent
  ],
  declarations: [
    PlantFormComponent,
    ConsumerFormComponent,
    PlantTypePipe,
    ConsumptionPredictionComponent,
    ProductionPredictionComponent,
    PredictionReviewComponent,
    RegistrationLayoutComponent,
    CUSTOM_VALIDATORS
  ],
  providers: [
    AreaOptionsService,
    ConsumerManagementService,
    HouseSizeOptionsService,
    PlantManagementService,
    ProductionPredictionService,
    ConsumptionPredictionService,
    DatePipe
  ]
})
export class RegistrationModule {
}
