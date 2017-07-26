import { Component, OnInit } from '@angular/core';
import { EthereumService } from "../../shared/ethereum.service";

import { HeaderType } from "./header-type.enum";
import { RegistrationStateService } from "../../shared/registration-state.service";
import { WalletDetails } from "../wallet-details";
import { WalletType } from "../../shared/wallet-type.enum";
import { PlantType } from "../../registration/plant-form/plant-form";

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {

  headerType = HeaderType;
  walletAddress : string;
  headerTypeValue : HeaderType;


  constructor(private ethereumService : EthereumService,
              private registrationStateService : RegistrationStateService) { }

  ngOnInit() {
    this.ethereumService.activeWallet()
      .subscribe(
        wallet => {
          this.walletAddress = wallet
          this.initHeader();
        },
        error => console.error(error)
      )
  }

  private initHeader() {
    this.registrationStateService.getActiveWalletDetails(this.walletAddress).subscribe(
      details => this.extractHeaderType(details),
      error => console.error(error)
    );
  }

  extractHeaderType(details : WalletDetails) {
    if (details.walletType == WalletType.CONSUMER) {
      this.headerTypeValue = HeaderType.CONSUMER
    } else {
      this.headerTypeValue = HeaderType[PlantType[details.plantType]]
    }
  }
}
