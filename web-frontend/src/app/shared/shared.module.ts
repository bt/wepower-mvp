import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {EthereumService} from "./ethereum.service";
import { RegistrationStateService } from "./registration-state.service";
import {TransactionsLogService} from "./transactions-log-service";


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [

  ],
  declarations: [],
  providers: [
    EthereumService,
    RegistrationStateService,
    TransactionsLogService
  ]
})
export class SharedModule { }
