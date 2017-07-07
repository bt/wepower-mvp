import { Component, OnInit } from '@angular/core';
import { PlantForm, PlantType } from "./plant-form";

import { GeoArea } from "../../shared/geo-area";
import { PlantManagementService } from "../plant-management.service";
import { AreaOptionsService } from "../area-options.service";
import {Period} from "../../shared/period";
import {GeoLocation} from "../../shared/geo-location";
import {EthereumService} from "../../shared/ethereum.service";

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
              private areasService: AreaOptionsService,
              private ethereumService: EthereumService) {
  }

  ngOnInit() {
    this.formData = this.defaultForm();
    this.areasService.loadAvailableAreas()
      .subscribe(
        availableAreas => this.supportedAreas = availableAreas,
        error =>  console.error(error)
      );
  }

  /**
   * Initiates plant creation based on form data
   */
  createPlant(): void {
    this.plantService.createPlant(this.formData)
      .subscribe(
        plantData => console.log(plantData),
        error => console.error(error)
      );
  }

  /**
   * Provides default values where needed for initial selections
   *
   * @returns {PlantForm}
   */
  defaultForm(): PlantForm {
    let form = new PlantForm()
    form.walletId = this.ethereumService.activeWallet();
    form.type = PlantType.SOLAR;
    form.areaCode = "DEU";

    form.activePeriod = new Period();
    form.location = new GeoLocation();

    return form;
  }
}
