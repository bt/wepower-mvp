import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl } from '@angular/forms';



import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';

import { ConsumerForm } from "./consumer-form";
import { GeoArea } from "../../shared/geo-area";
import { AreaOptionsService } from "../area-options.service";
import { HouseSizeOptionsService } from "../house-size-options.service";
import { HouseSize } from "../../shared/house-size";
import { ConsumerManagementService } from "../consumer-management.service";
import { EthereumService} from "../../shared/ethereum.service";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-consumer-form',
  templateUrl: './consumer-form.component.html',
  styleUrls: ['./consumer-form.component.scss']
})
export class ConsumerFormComponent implements OnInit {

  formData : ConsumerForm;
  supportedAreas : Array<GeoArea>;
  supportedHouseSizes : Array<HouseSize>;
  areaControl = new FormControl();

  filteredAreas: Observable<string[]>;

  constructor(private areasService : AreaOptionsService,
              private houseSizeService : HouseSizeOptionsService,
              private consumerService : ConsumerManagementService,
              private ethereumService : EthereumService,
              private router : Router) { }

  ngOnInit() {
    this.formData = this.defaultForm();

    this.areasService.loadAvailableAreas()
      .subscribe(
        availableAreas => {
          this.supportedAreas = availableAreas
          this.filteredAreas = this.areaControl.valueChanges
            .startWith(null)
            .map(val => val ? this.filter(val) : this.supportedAreas.map(area => area.name).slice());
        },
        error =>  console.error(error)

      );

    this.houseSizeService.loadAvailableSizes()
      .subscribe(
        availableSizes => this.supportedHouseSizes = availableSizes,
        error => console.error(error)
      );
  }

  /**
   * Initiates plant creation based on form data
   *
   */
  createConsumer(): void {
    this.consumerService.createConsumer(this.getUpdatedForm())
      .subscribe(
        customerData => this.router.navigateByUrl('/register/consumer/review'),
        error => console.error(error)
      );
  }

  /**
   * Provides default values where needed for initial selections
   *
   * @returns {ConsumerForm}
   */
  private defaultForm() {
    let form = new ConsumerForm();
    form.walletId = this.ethereumService.activeWallet();
    form.houseSizeCode = "M";
    return form;
  }

  private getUpdatedForm() : ConsumerForm {
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
