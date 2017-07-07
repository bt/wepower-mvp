import { Component, OnInit } from '@angular/core';
import {EthereumService} from "../shared/ethereum.service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  private etherium: EthereumService;

  connectedToWallet : boolean;

  constructor(etherium : EthereumService) {
    this.etherium = etherium;
  }

  ngOnInit() {
    console.log(this.etherium.activeWallet());
    this.connectedToWallet = this.etherium.isActiveConnection();
    console.log(this.connectedToWallet);
  }
}
