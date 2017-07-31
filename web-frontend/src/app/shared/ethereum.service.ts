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


var Web3 = require('web3');

var exchange_artifact = require('../../../compiled_contracts/ExchangeSmartContract.json');

@Injectable()
export class EthereumService {

  private walletLoading: Observable< string>
  private web3: any

  private exchange: any;

  constructor(private transactionsLog: TransactionsLogService) { }

  loadConnection()  {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window['web3'] === 'undefined') {
      console.error("No web3 detected! Is MetaMask on?");
      return false;
    }
    // Use Mist/MetaMask's provider
    this.web3 = new Web3(window['web3'].currentProvider);

    contract(exchange_artifact).deployed().then(function(instance) {
        this.exchange = instance;
        const plantCreatedEvent = this.exchange.CreatePlant({_from: this.web3.eth.coinbase});
        plantCreatedEvent.watch(function(err, result) {
            if (err) {
                console.log(err)
                return;
            }
            console.log("PLANT CREATED EVENT")
            console.log(result.args._value)
        })
        const transferEvent = this.exchange.Transfer({_from: this.web3.eth.coinbase});
        transferEvent.watch(function(err, result) {
            if (err) {
                console.log("TRANSFER EVENT ERROR")
                console.log(err)
                return;
            }
            console.log("TRANSFER EVENT")
            console.log(result.args._value)
            this.logTransaction(result.transactionHash);
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

        return Observable.of(wallet)
      })
      .map(wallet => 5)
      .catch(error => {
        console.error(error)
        return Observable.of(0)
      })
  }

  private observeBalance(walletId: string): Observable<any> {
    let executor = Observable.bindCallback(this.web3.eth.getBalance)

    return executor()
      .map(result => {
        // Returns [Error, Array<Account>]
        return result[1][0]
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

  registerPlant(data: BlockchainPlantData): Observable<string> {
     let dates = data.predictions ? data.predictions.map(
         prediction => prediction.date.getTime()
     ) : []

     let amounts = data.predictions ? data.predictions.map(
         prediction => prediction.energyPrediction
     ) : []

      return this.activeWallet()
          .flatMap(wallet => {
              if (!wallet) {
                  return Observable.throw("Wallet is not present")
              }

              return Observable.of(this.exchange.createPlantContract.sendTransaction(
                  wallet,
                  this.ethToWei(data.price),
                  PlantType[data.source],
                  amounts,
                  dates,
                  {from: this.web3.eth.coinbase}))
          })
  }

  setPrice(price: number): Promise<string> {
    return this.exchange.setPrice.sendTransaction(price, {from: this.web3.eth.coinbase})
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
