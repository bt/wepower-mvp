import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LandingComponent } from './landing.component';
import { SharedModule } from "../shared/shared.module";
import { ExistingUserGuardService } from "./router-guards/existing-user-guard.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    LandingComponent
  ],
  declarations: [LandingComponent],
  providers: [ExistingUserGuardService]
})
export class LandingModule { }
