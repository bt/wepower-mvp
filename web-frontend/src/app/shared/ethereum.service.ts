import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/operator/toPromise';
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/filter";

var Web3 = require('web3');

@Injectable()
export class EthereumService {

  private walletLoading : Observable<string>
  private web3 : any;

  constructor() { }

  loadConnection() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window['web3'] === 'undefined') {
      console.error("No web3 detected! Is MetaMask is on?");
      return false;
    }
    // Use Mist/MetaMask's provider
    this.web3 = new Web3(window['web3'].currentProvider);
  }

  activeWallet() : Observable<string> {
    if (!this.isActiveConnection()) {
      this.loadConnection()
    }

    let accountObservable = Observable.bindCallback(this.web3.eth.getAccounts)

    return accountObservable()
      .map(result => {
        // Returns [Error, Array<Account>]
        return result[1][0]
      })
      .timeout(500)
      .catch((error) => {
        console.log(error)
        return Observable.of(null)
      })
  }

  walletBalance() : Observable<number> {
    return this.activeWallet()
      .mergeMap(wallet => {
        if (!wallet) {
          return Observable.throw("Wallet is not present")
        }

        return Observable.of(wallet)
      })
      .map(wallet => 5)
      .catch(error => {
        console.error(error)
        return Observable.of(0)
      })
  }

  private observeBalance(walletId : string) : Observable<any> {
    let executor = Observable.bindCallback(this.web3.eth.getBalance)

    return executor()
      .map(result => {
        // Returns [Error, Array<Account>]
        return result[1][0]
      })
  }

  isActiveConnection() : boolean {
    return this.web3 != null
  }

  weiToETH(weiAmount : number) : number {
    return this.web3.fromWei(weiAmount, 'ether')
  }
}
