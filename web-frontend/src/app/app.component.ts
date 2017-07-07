import { Component } from '@angular/core';
import {EthereumService} from "./shared/ethereum.service";


const contract = require('truffle-contract');
const metaincoinArtifacts = require('../../compiled_contracts/MetaCoin.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  MetaCoin = contract(metaincoinArtifacts);

  account: any;
  accounts: any;
  web3: any;

  balance: number;
  etherium: EthereumService;

  constructor(etherium : EthereumService) {
    this.etherium = etherium;
    this.checkAndInstantiateWeb3();
  }

  checkAndInstantiateWeb3() {
    this.etherium.loadConnection();
  }
}
