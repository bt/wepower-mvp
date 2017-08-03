import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/operator/toPromise';
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/filter";
import { default as contract } from 'truffle-contract'
import {BlockchainPlantData} from "./blockchain-plant";
import {PlantType} from "../registration/plant-form/plant-form";
import {TransactionsLogService} from "./transactions-log-service";
import {error} from "util";


var Web3 = require('web3');

var exchange_artifact = require('../../../compiled_contracts/ExchangeSmartContract.json');

@Injectable()
export class EthereumService {

  private walletLoading: Observable< string>
  private web3: any

  private exchange: any;

  private ExchangeContract = contract(exchange_artifact);

  constructor(private transactionsLog: TransactionsLogService) { }

  loadConnection()  {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window['web3'] === 'undefined') {
      console.error("No web3 detected! Is MetaMask on?");
      return false;
    }
    // Use Mist/MetaMask's provider
    this.web3 = new Web3(window['web3'].currentProvider);

    this.ExchangeContract.setProvider(new this.web3.providers.HttpProvider('http://localhost:8545'));

    let _self = this;
    this.ExchangeContract.deployed().then(function(instance) {
        _self.exchange = instance
        const transferEvent = _self.exchange.Transfer({_from: _self.web3.eth.coinbase})
        transferEvent.watch(function(err, result) {
            if (err) {
                console.log("TRANSFER EVENT ERROR")
                console.log(err)
                return;
            }
            console.log("TRANSFER EVENT")
            console.log(result.args._value)
            _self.logTransaction(result.transactionHash);
        })
    });



    return true;
  }

  activeWallet(): Observable<string> {
    if (!this.isActiveConnection()) {
      this.loadConnection()
    }

    let promise = new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((error, result) => {
        if (!result) {
          resolve(null)
        } else {
          this.web3.eth.defaultAccount = result[0];
          resolve(result[0]);
        }
      })
    });

    return Observable.fromPromise(promise)
      .timeout(1000)
      .catch((error) => {
        console.log(error)
        return Observable.of(null)
      })
  }

  walletBalance(): Observable<number> {

    return this.activeWallet()
      .mergeMap(wallet => {
        if (!wallet) {
          return Observable.throw("Wallet is not present")
        }
        return this.observeBalance(wallet);
      })
      .catch(error => {
        console.error(error)
        return Observable.of(0)
      })
  }

  private observeBalance(walletId: string): Observable<number> {
      let promise = new Promise((resolve, reject) => {
          this.web3.eth.getBalance(walletId, (error, result) => {
              if (!result) {
                  resolve(null)
              } else {
                  resolve(result);
              }
          })
      });

      return Observable.fromPromise(promise)
          .timeout(1000)
          .catch((error) => {
              console.log(error)
              return Observable.of(null)
          })
  }

  private logTransaction(transactionId: string): void {
      this.web3.eth.getTransaction(transactionId, function(error, result) {
         if (error) {
             console.log(error);
             return;
         }

         this.transactionsLog.log(result.from, result.to, transactionId);
      });
  }

  registerPlant(wallet: string, data: BlockchainPlantData): Observable<string> {
      console.log("REGISTER")

      let dates = data.predictions ? data.predictions.map(
          prediction => { return prediction.date.getTime() / 1000 }
      ) : []

      let amounts = data.predictions ? data.predictions.map(
          prediction => prediction.energyPrediction
      ) : []

      let self_ = this;


      let promise = this.exchange.createPlantContract.sendTransaction(
              wallet,
              this.ethToWei(data.price),
              PlantType[data.source],
              amounts,
              dates,
              {from: this.web3.eth.coinbase, gas: 4000000})

      return Observable.fromPromise(promise)
          .timeout(1000)
          .catch((error) => {
              console.log(error)
              return Observable.throw(error)
          })
  }

  setPrice(wallet: string, price: number): Observable<string> {
    let promise = this.exchange.setPrice.sendTransaction(wallet, price, {from: this.web3.eth.coinbase, gas: 2000000})
    return Observable.fromPromise(promise)
      .timeout(1000)
      .catch((error) => {
          console.log(error)
          return Observable.throw(error)
      })
  }

  getPrice(wallet: string): Observable<any> {
      let promise = this.exchange.getPrice.call(wallet, {from: this.web3.eth.coinbase})

      return Observable.fromPromise(promise)
          .timeout(1000)
          .catch((error) => {
              console.log(error)
              return Observable.throw(error)
          })
  }

   getTotalAmount(wallet: string, date: number): Observable<number> {
       const dateInSeconds: number = date / 1000
       const promise = this.exchange.getTotalAmount.call(wallet, dateInSeconds, {from: this.web3.eth.coinbase}, {gas:4500000})

        return Observable.fromPromise(promise)
            .timeout(1000)
            .catch((error) => {
                console.log(error)
                return Observable.throw(error)
            })
   }

  buy(plant: string, amount: number, date: Date): void {
      this.exchange.buy.sendTransaction(plant, amount, date, {from: this.web3.eth.coinbase})
  }

  transfer(to: string, amount: number, date: Date): void {
      this.exchange.transfer.sendTransaction(to, amount, date, {from: this.web3.eth.coinbase})
  }

  getOwned(date: Date): number {
      return 0;
  }

  getBestPrice(amount: number, date: Date, type: PlantType): number {
      return 0
  }

  isActiveConnection(): boolean {
    return this.web3 != null
  }

  weiToETH(weiAmount: number): number {
    return this.web3.fromWei(weiAmount, 'ether')
  }

  ethToWei(ethAmount: number): number {
      return this.web3.toWei(ethAmount)
  }

  private waitForMine(): void {
      this.web3.eth.filter('latest', function(error, result){
          if (!error) {
              console.log("MINED")
              this.web3.eth.getBlock(result, true, function (error, result) {
                  console.log("BLOCK");
                  console.log(result);
              });
          } else {
              console.log("MINED WITH ERROR")
              console.error(error)
          }
          this.web3.eth.filter.stopWatch();
      });
  }

}
