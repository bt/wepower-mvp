import { Injectable } from '@angular/core';
import {GeoArea} from "../shared/geo-area";

@Injectable()
export class AreaOptionsService {

  constructor() { }

  loadAvailableAreas(): Promise<Array<GeoArea>> {
    // TODO: Replace with load from backend
    return Promise.resolve(
      [
        new GeoArea("Germany", "GER"),
        new GeoArea("Spain", "ESP"),
        new GeoArea("Italy", "ITA")
      ]
    )
  }
}
