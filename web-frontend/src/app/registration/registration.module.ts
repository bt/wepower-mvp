import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PlantFormComponent } from './plant-form/plant-form.component';
import { ConsumerFormComponent } from './consumer-form/consumer-form.component';
import {AreaOptionsService} from "./area-options.service";
import {PlantManagementService} from "./plant-management.service";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    PlantFormComponent,
    ConsumerFormComponent
  ],
  declarations: [
    PlantFormComponent,
    ConsumerFormComponent
  ],
  providers: [
    AreaOptionsService,
    PlantManagementService
  ]
})
export class RegistrationModule { }
