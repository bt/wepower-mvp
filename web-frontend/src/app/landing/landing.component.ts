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
    // Literaly I have no idea why this helps
    setTimeout(() => {}, 200)

    this.etherium.activeWallet()
      .subscribe(
        wallet => {
          if (wallet) {
            this.connectedToWallet = true
          }
        },
        error => console.error(error)
      );
  }
}
