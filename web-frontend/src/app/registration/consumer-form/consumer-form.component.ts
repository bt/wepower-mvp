import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import * as moment from 'moment'

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';

import {ConsumerForm} from "./consumer-form";
import {GeoArea} from "../../shared/geo-area";
import {AreaOptionsService} from "../area-options.service";
import {HouseSizeOptionsService} from "../house-size-options.service";
import {HouseSize} from "../../shared/house-size";
import {ConsumerManagementService} from "../consumer-management.service";
import {EthereumService} from "../../shared/ethereum.service";


@Component({
  selector: 'app-consumer-form',
  templateUrl: './consumer-form.component.html',
  styleUrls: ['./consumer-form.component.scss']
})
export class ConsumerFormComponent implements OnInit {

  formData : ConsumerForm;
  supportedAreas : Array<GeoArea>;
  supportedHouseSizes : Array<HouseSize>;

  filteredAreas: string[];

  constructor(private areasService : AreaOptionsService,
              private houseSizeService : HouseSizeOptionsService,
              private consumerService : ConsumerManagementService,
              private ethereumService : EthereumService,
              private router : Router) { }

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
  private updateDefaultForm() {
    this.formData = new ConsumerForm()
    this.formData.houseSizeCode = 'M'
    this.formData.consumption = 3500

    this.ethereumService.activeWallet()
      .subscribe(
        wallet => {
          let form = new ConsumerForm()

          form.houseSizeCode = this.formData.houseSizeCode
          form.consumption = this.formData.consumption
          form.walletId = wallet

          this.formData = form
        },
        error => console.error(error)
      );

  }

  private getUpdatedForm() : ConsumerForm {
    let selectedArea = this.supportedAreas
      .find(area => area.name == this.formData.areaName)
    this.formData.areaCode = selectedArea.code
    this.formData.meterId = this.formData.walletId
    this.formData.consumeFrom = moment().add(1, 'day').toDate()
    this.formData.consumeTo = moment().add(1, 'month').add(1, 'day').toDate()

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

  setConsumption(choiceIndex: number): void {
    const consumptionValues = [2000, 3500, 5000]
    this.formData.consumption = consumptionValues[choiceIndex]
  }
}

