import { Component, OnInit } from '@angular/core';
import {EthereumService} from "../shared/ethereum.service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  private etherium: EthereumService;

  connectedToWallet : boolean;

  constructor(etherium : EthereumService) {
    this.etherium = etherium;
  }

  ngOnInit() {
    this.connectedToWallet = this.etherium.isActiveConnection();
  }
}
