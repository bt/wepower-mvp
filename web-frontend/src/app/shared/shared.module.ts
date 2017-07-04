import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Period } from "./period";
import { GeoLocation } from "./geo-location";
import {GeoArea} from "./geo-area";

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    GeoArea,
    GeoLocation,
    Period
  ],
  declarations: []
})
export class SharedModule { }
