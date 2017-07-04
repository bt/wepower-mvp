import { Component, OnInit } from '@angular/core';
import { PlantForm, PlantType } from "./plant-form";

import { GeoArea } from "../../shared/geo-area";
import { PlantManagementService } from "../plant-management.service";
import { AreaOptionsService } from "../area-options.service";
import {Period} from "../../shared/period";
import {GeoLocation} from "../../shared/geo-location";

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
  supportedAreas : Array<GeoArea>;

  constructor(private plantService: PlantManagementService,
              private areasService: AreaOptionsService) {
  }

  ngOnInit() {
    this.formData = this.defaultForm();
    this.areasService.loadAvailableAreas()
      .then(availableAreas => this.supportedAreas = availableAreas)
      .catch(reason => console.log(reason));
  }

  /**
   * Initiates plant creation based on form data
   */
  createPlant(): void {
    this.plantService.createPlant(this.formData);
    console.log(this.formData);
  }

  /**
   * Provides default values where needed for initial selections
   *
   * @returns {PlantForm}
   */
  defaultForm(): PlantForm {
    let form = new PlantForm()
    form.type = PlantType.SOLAR;
    form.areaCode = "GER";

    form.activePeriod = new Period();
    form.location = new GeoLocation();

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
