import { Component, OnInit } from '@angular/core';
import {EthereumService} from "../shared/ethereum.service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  private etherium: EthereumService;

  connectedToWallet = false
  usingChrome = false

  constructor(etherium: EthereumService) {
    this.etherium = etherium;
  }

  ngOnInit() {
    this.usingChrome = window.navigator.userAgent.toLowerCase().includes("chrome")
    console.log("Im using chrome" + this.usingChrome)

    this.etherium.activeWallet()
      .toPromise()
      .then(wallet => {
          if (wallet) {
            this.connectedToWallet = true
          }
        },
        error => console.error(error)
      );
  }
}
