import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    LandingComponent
  ],
  declarations: [LandingComponent]
})
export class LandingModule { }
