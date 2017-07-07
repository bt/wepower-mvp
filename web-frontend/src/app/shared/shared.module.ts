import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {EthereumService} from "./ethereum.service";


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [

  ],
  declarations: [],
  providers: [
    EthereumService
  ]
})
export class SharedModule { }
