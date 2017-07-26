import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl } from '@angular/forms';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/startWith';

import { PlantForm, PlantType } from "./plant-form";
import { GeoArea } from "../../shared/geo-area";
import { PlantManagementService } from "../plant-management.service";
import { AreaOptionsService } from "../area-options.service";
import { Period } from "../../shared/period";
import { GeoLocation } from "../../shared/geo-location";
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

  areaControl = new FormControl();

  filteredAreas: Observable<string[]>;


  constructor(private plantService: PlantManagementService,
              private areasService: AreaOptionsService,
              private ethereumService: EthereumService,
              private router: Router) {
  }

  ngOnInit() {
    this.formData = this.defaultForm();
    this.areasService.loadAvailableAreas()
      .subscribe(
        availableAreas => {
          this.supportedAreas = availableAreas
          this.filteredAreas = this.areaControl.valueChanges
            .startWith(null)
            .map(val => val ? this.filter(val) : this.supportedAreas.map(area => area.name).slice())
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
  defaultForm(): PlantForm {
    let form = new PlantForm()
    form.walletId = this.ethereumService.activeWallet();
    form.type = PlantType.SOLAR;

    form.activePeriod = new Period();
    form.location = new GeoLocation();

    return form;
  }

  private getUpdatedForm() : PlantForm {
    let selectedArea = this.supportedAreas
      .find(area => area.name == this.formData.areaName)
    this.formData.areaCode = selectedArea.code

    return this.formData
  }

  filter(val: string): string[] {
    return this.supportedAreas
      .filter(area => new RegExp(`^${val}`, 'gi')
        .test(area.name))
      .map(area => area.name);
  }
}
