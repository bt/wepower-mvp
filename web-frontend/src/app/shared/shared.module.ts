import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {EthereumService} from "./ethereum.service";
import { RegistrationStateService } from "./registration-state.service";


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [

  ],
  declarations: [],
  providers: [
    EthereumService,
    RegistrationStateService
  ]
})
export class SharedModule { }
