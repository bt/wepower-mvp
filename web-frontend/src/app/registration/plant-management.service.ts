import { Injectable } from '@angular/core';
import {PlantForm} from "./plant-form/plant-form";

@Injectable()
export class PlantManagementService {

  constructor() { }

  createPlant(plantData : PlantForm): void {
    //  TODO: Issue request to backend.
  }
}
