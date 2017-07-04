import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Period } from "./period";
import { GeoLocation } from "./geo-location";
import {GeoArea} from "./geo-area";
import {HouseSize} from "./house-size";

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    GeoArea,
    GeoLocation,
    HouseSize,
    Period
  ],
  declarations: []
})
export class SharedModule { }
