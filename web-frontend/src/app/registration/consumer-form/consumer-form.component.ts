import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";


import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConsumerForm } from "./consumer-form";
import { GeoArea } from "../../shared/geo-area";
import { AreaOptionsService } from "../area-options.service";
import { HouseSizeOptionsService } from "../house-size-options.service";
import { HouseSize } from "../../shared/house-size";
import { ConsumerManagementService } from "../consumer-management.service";
import { EthereumService} from "../../shared/ethereum.service";

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
              private consumerService : ConsumerManagementService,
              private ethereumService : EthereumService,
              private router : Router) { }

  ngOnInit() {
    this.formData = this.defaultForm();

    this.areasService.loadAvailableAreas()
      .subscribe(
        availableAreas => this.supportedAreas = availableAreas,
        error =>  console.error(error)
      );

    this.houseSizeService.loadAvailableSizes()
      .subscribe(
        availableSizes => this.supportedHouseSizes = availableSizes,
        error => console.log(error)
      );
  }

  /**
   * Initiates plant creation based on form data
   *
   */
  createConsumer(): void {
    this.consumerService.createConsumer(this.formData)
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
    form.areaCode = "ITA";
    return form;
  }
}
