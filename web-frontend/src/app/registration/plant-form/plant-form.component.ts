import { Component, OnInit } from '@angular/core';
import { PlantForm, PlantType } from "./plant-form";

import { GeoArea } from "../../shared/geo-area";
import { PlantManagementService } from "../plant-management.service";
import { AreaOptionsService } from "../area-options.service";

@Component({
  selector: 'app-plant-form',
  templateUrl: './plant-form.component.html',
  styleUrls: ['./plant-form.component.css']
})
export class PlantFormComponent implements OnInit {

  // Filter out only Enum values.
  // In typescript enum is based on javascript object, keys array also contains index based keys.
  plantTypeValues = Object.keys(PlantType)
    .filter(key => isNaN(Number(key)))
    .map(key => PlantType[key]);

  formData : PlantForm;
  areas : Array<GeoArea>;

  constructor(private plantService: PlantManagementService,
              private areasService: AreaOptionsService) {
  }

  ngOnInit() {
    this.formData = this.defaultForm();
    this.areasService.loadAvailableAreas()
      .then(value => this.areas = value)
      .catch(reason => console.log(reason));
  }

  savePlant(): void {
    this.plantService.createPlant(this.formData);
  }

  defaultForm(): PlantForm {
    let form = new PlantForm()
    form.type = PlantType.SOLAR;
    form.areaCode = "GER";
    return form;
  }

  /**
   * Temporary.
   * Converts plant type to nice display name
   *
   * @param type
   * @returns {any}
   */
  displayPlantType(type : PlantType): string {
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
