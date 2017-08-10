import { Component } from '@angular/core';
import {EthereumService} from "./shared/ethereum.service";


const contract = require('truffle-contract');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  account: any;
  accounts: any;
  web3: any;

  balance: number;
  etherium: EthereumService;

  constructor(etherium: EthereumService) {
    this.etherium = etherium;
  }

  ngOnInit() {
  }
}
