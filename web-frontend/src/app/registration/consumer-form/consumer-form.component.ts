import { Component, OnInit } from '@angular/core';
import {ConsumerForm} from "./consumer-form";
import {GeoArea} from "../../shared/geo-area";
import {AreaOptionsService} from "../area-options.service";
import {HouseSizeOptionsService} from "../house-size-options.service";
import {HouseSize} from "../../shared/house-size";
import {ConsumerManagementService} from "../consumer-management.service";

@Component({
  selector: 'app-consumer-form',
  templateUrl: './consumer-form.component.html',
  styleUrls: ['./consumer-form.component.css']
})
export class ConsumerFormComponent implements OnInit {

  formData : ConsumerForm;
  supportedAreas : Array<GeoArea>;
  supportedHouseSizes : Array<HouseSize>;

  constructor(private areasService : AreaOptionsService,
              private houseSizeService : HouseSizeOptionsService,
              private consumerService : ConsumerManagementService) { }

  ngOnInit() {
    this.formData = this.defaultForm();

    this.areasService.loadAvailableAreas()
      .then(availableAreas => this.supportedAreas = availableAreas)
      .catch(reason => console.log(reason));

    this.houseSizeService.loadAvailableSizes()
      .then(availableSizes => this.supportedHouseSizes = availableSizes)
      .catch(reason => console.log(reason));
  }

  /**
   * Initiates plant creation based on form data
   */
  createConsumer(): void {
    this.consumerService.createConsumer(this.formData);
  }

  /**
   * Provides default values where needed for initial selections
   *
   * @returns {ConsumerForm}
   */
  private defaultForm() {
    let form = new ConsumerForm();
    form.houseSizeCode = "M";
    return form;
  }
}
