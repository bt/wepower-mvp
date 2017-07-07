import { Injectable } from '@angular/core';

var Web3 = require('web3');

@Injectable()
export class EthereumService {

  private walletId : string;
  private web3 : any;

  constructor() { }

  loadConnection() : boolean {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window['web3'] === 'undefined') {
      console.error("No web3 detected! Is MetaMask is on?");
      return false;
    }
    // Use Mist/MetaMask's provider
    this.web3 = new Web3(window['web3'].currentProvider);
    this.walletId = this.web3.eth.accounts[0];
    return true;
  }

  activeWallet() : string {
    return this.walletId;
  }

  isActiveConnection() : boolean {
    return this.web3 != null && this.walletId != null;
  }
}
