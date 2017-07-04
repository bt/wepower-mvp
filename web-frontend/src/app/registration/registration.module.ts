import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';

import { PlantFormComponent } from './plant-form/plant-form.component';
import { ConsumerFormComponent } from './consumer-form/consumer-form.component';
import {AreaOptionsService} from "./area-options.service";
import {PlantManagementService} from "./plant-management.service";
import {HouseSizeOptionsService} from "./house-size-options.service";
import {ConsumerManagementService} from "./consumer-management.service";
import { PlantTypePipe } from './plant-type.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule
  ],
  exports: [
    PlantFormComponent,
    ConsumerFormComponent
  ],
  declarations: [
    PlantFormComponent,
    ConsumerFormComponent,
    PlantTypePipe
  ],
  providers: [
    AreaOptionsService,
    ConsumerManagementService,
    HouseSizeOptionsService,
    PlantManagementService
  ]
})
export class RegistrationModule { }
