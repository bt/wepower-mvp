import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantFormComponent } from './plant-form/plant-form.component';
import { ConsumerFormComponent } from './consumer-form/consumer-form.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    PlantFormComponent,
    ConsumerFormComponent
  ],
  declarations: [
    PlantFormComponent,
    ConsumerFormComponent
  ]
})
export class RegistrationModule { }
