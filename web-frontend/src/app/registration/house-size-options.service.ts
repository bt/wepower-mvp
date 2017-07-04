import { Injectable } from '@angular/core';
import { HouseSize } from "../shared/house-size";

@Injectable()
export class HouseSizeOptionsService {

  constructor() { }

  loadAvailableSizes(): Promise<Array<HouseSize>> {
    // TODO: Replace with load from backend
    return Promise.resolve(
      [
        new HouseSize("S", "10 - 50 m2"),
        new HouseSize("M", "50 - 100 m2"),
        new HouseSize("L", "100 - 150 m2")
      ]
    )
  }
}
