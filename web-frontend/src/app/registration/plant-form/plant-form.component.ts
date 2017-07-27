import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import 'rxjs/add/operator/startWith';

import { PlantForm, PlantType } from "./plant-form";
import { GeoArea } from "../../shared/geo-area";
import { PlantManagementService } from "../plant-management.service";
import { AreaOptionsService } from "../area-options.service";
import { EthereumService } from "../../shared/ethereum.service";

@Component({
  selector: 'app-plant-form',
  templateUrl: './plant-form.component.html',
  styleUrls: ['./plant-form.component.scss']
})
export class PlantFormComponent implements OnInit {

  // Filter out only Enum values.
  // In typescript enum is based on javascript object, keys array also contains index based keys.
  plantTypeValues = Object.keys(PlantType)
    .filter(key => isNaN(Number(key)))
    .map(key => PlantType[key]);

  formData : PlantForm;
  supportedAreas : Array<GeoArea>;

  filteredAreas: string[];


  constructor(private plantService: PlantManagementService,
              private areasService: AreaOptionsService,
              private ethereumService: EthereumService,
              private router: Router) {
  }

  ngOnInit() {
    this.updateDefaultForm();
    this.areasService.loadAvailableAreas()
      .subscribe(
        availableAreas => {
          this.supportedAreas = availableAreas
          this.filteredAreas = this.supportedAreas.map(area => area.name).slice()
        },
        error =>  console.error(error)
      );
  }

  /**
   * Initiates plant creation based on form data
   */
  createPlant(): void {
    this.plantService.createPlant(this.formData)
      .subscribe(
        plantData => this.router.navigateByUrl('/register/plant/review'),
        error => console.error(error)
      );
  }

  /**
   * Provides default values where needed for initial selections
   *
   * @returns {PlantForm}
   */
  updateDefaultForm() {
    this.formData = new PlantForm()
    this.formData.type = PlantType.SOLAR;

    this.ethereumService.activeWallet()
      .subscribe(
        wallet => this.formData.walletId = wallet,
        error => console.error(error))
  }

  private getUpdatedForm() : PlantForm {
    let selectedArea = this.supportedAreas
      .find(area => area.name == this.formData.areaName)
    this.formData.areaCode = selectedArea.code

    return this.formData
  }



  updateFilteredAreas(val: string) {
    this.filteredAreas = this.filter(val)
  }

  filter(val: string): string[] {
    return this.supportedAreas
      .filter(area => new RegExp(`^${val}`, 'gi')
        .test(area.name))
      .map(area => area.name);
  }
}
