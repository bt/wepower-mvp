import { Pipe, PipeTransform } from '@angular/core';

import { PlantType } from "./plant-form/plant-form";

/**
 * Used to convert existing plant types to nice display name.
 *
 */
@Pipe({
  name: 'plantType'
})
export class PlantTypePipe implements PipeTransform {

  transform(type: PlantType, args?: any): string {
    switch (type) {
      case (PlantType.HYDRO):
        return "Hydro"
      case (PlantType.SOLAR):
        return "Solar"
      case (PlantType.WIND):
        return "Wind"
    }
  }
}
