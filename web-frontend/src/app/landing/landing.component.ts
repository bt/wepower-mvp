import { Component, OnInit } from '@angular/core';
import {EthereumService} from "../shared/ethereum.service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  private etherium: EthereumService;

  connectedToWallet = false;

  constructor(etherium : EthereumService) {
    this.etherium = etherium;
  }

  ngOnInit() {
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
