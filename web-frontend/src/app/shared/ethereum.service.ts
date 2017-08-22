import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";

import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/operator/toPromise';
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/filter";
import { environment } from "../../environments/environment";
import {BlockchainPlantData} from "./blockchain-plant";
import {PlantType} from "../registration/plant-form/plant-form";
import {TransactionsLogService} from "./transactions-log-service";

var Web3 = require('web3');

var exchange_artifact = require('../../../compiled_contracts/ExchangeSmartContract.json');

@Injectable()
export class EthereumService {

    private walletLoading: Observable<string>
    private web3: any

    private contract: any

    constructor(private transactionsLog: TransactionsLogService) {}

    loadConnection(): Promise<any> {
        console.log("Load web3 connection")
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof window['web3'] === 'undefined') {
            console.error("No web3 detected! Is MetaMask on?");
            return Promise.reject("No web3 detected! Is MetaMask on?");
        }
        // Use Mist/MetaMask's provider
        this.web3 = new Web3(window['web3'].currentProvider);
        this.contract = this.web3.eth.contract(exchange_artifact.abi).at(this.parseAddress());

        return new Promise((resolve, reject) => resolve())
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
        const promise = new Promise((resolve, reject) => {
            this.web3.eth.getBalance(walletId, (error, result) => {
                if (!result) {
                    resolve(null)
                } else {
                    resolve(result);
                }
            })
        });

        return Observable.fromPromise(promise).catch(error => Observable.of(null))
    }

    registerPlant(wallet: string, data: BlockchainPlantData): Observable<string> {
        const dates = data.predictions ? data.predictions.map(
            prediction => prediction.date.getTime() / 1000
        ) : []

        const amounts = data.predictions ? data.predictions.map(
            prediction => prediction.energyPrediction
        ) : []

        const self_ = this;



        const promise = new Promise(function (resolve, reject) {
            self_.contract.createPlantContract.sendTransaction(wallet,
                self_.ethToWei(data.price),
                PlantType[data.source],
                amounts,
                dates, function (err, result) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(result)
                })
        })
            .then(txHash => self_.getTransactionReceiptMined(txHash, 500))
            .then(receipt => console.log(receipt))

        return Observable.fromPromise(promise).catch(error => Observable.throw(error))
    }

    setPrice(wallet: string, price: number): Observable<string> {
        const self_ = this
        const promise = new Promise(function (resolve, reject) {
            self_.contract.setPrice.sendTransaction(wallet, price, function (err, result) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(result)
            })
        }).then(txHash => self_.getTransactionReceiptMined(txHash, 500))
            .then(receipt => console.log(receipt))
        return Observable.fromPromise(promise).catch(error => Observable.throw(error))
    }

    getPrice(wallet: string): Observable<any> {
        if (wallet === '0x0000000000000000000000000000000000000000') {
            return Observable.of(0)
        }
        const self_ = this
        const promise = new Promise(function (resolve, reject) {
            self_.contract.getPrice.call(wallet, function (err, result) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(result)
            })
        })

        return Observable.fromPromise(promise).catch(error => Observable.throw(error))
    }

    getTotalAmount(wallet: string, date: Date): Observable<number> {
        const dateInSeconds: number = date.getTime() / 1000
        const self_ = this

        const promise = new Promise(function (resolve, reject) {
            self_.contract.getTotalAmount.call(wallet, dateInSeconds, function (err, result) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(result)
            })
        })

        return Observable.fromPromise(promise).catch(error => Observable.throw(error))
    }

    buy(plant: string, amount: number, date: Date, price: number): Observable<any> {
        const self_ = this

        const promise = new Promise(function (resolve, reject) {
            self_.contract.buy.sendTransaction(
                plant,
                date.getTime() / 1000,
                amount,
                {value: self_.ethToWei(price)},
                function (err, result) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(result)
            })
        }).then(txHash => self_.getTransactionReceiptMined(txHash, 500))

        return Observable.fromPromise(promise)
            .mergeMap(receipt => self_.logTransaction(receipt.transactionHash, plant, price, amount, date))
            .catch(error => Observable.throw(error))
    }

    transfer(plant: string, to: string, amount: number, date: Date): Observable<any> {
        const self_ = this

        const promise = new Promise(function (resolve, reject) {
            self_.contract.send.sendTransaction(
                plant,
                to,
                date.getTime() / 1000,
                amount,
                function (err, result) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(result)
                })
        }).then(txHash => self_.getTransactionReceiptMined(txHash, 500))
            .then(receipt => console.log(receipt))

        return Observable.fromPromise(promise).catch(error => Observable.throw(error))
    }

    getSourceOf(wallet: string, date: Date): Observable<number> {
        const self_ = this

        const promise = new Promise(function (resolve, reject) {
            self_.contract.getSourceOf.call(
                wallet,
                date.getTime() / 1000,
                function (err, result) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(result)
                })
        })

        return Observable.fromPromise(promise).catch(error => Observable.throw(error))
    }

    getOwned(wallet: string, date: Date): Observable<number> {
        const self_ = this

        const promise = new Promise(function (resolve, reject) {
            self_.contract.getBalance.call(
                wallet,
                date.getTime() / 1000,
                function (err, result) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(result)
                })
        })

        return Observable.fromPromise(promise).catch(error => Observable.throw(error))
    }

    getBestPrice(amount: number, date: Date, type: PlantType): Observable<string> {
        const self_ = this

        const promise = new Promise(function (resolve, reject) {
            self_.contract.getLowestPrice.call(
                amount,
                date.getTime() / 1000,
                type,
                function (err, result) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(result)
                })
        })

        return Observable.fromPromise(promise).catch(error => Observable.throw(error))
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

    private parseAddress(): string {
        let address = ''
        if (address !== '') {
            return address
        }

        const diff = 0
        const currentTime: number = new Date().getTime()
        Object.keys(exchange_artifact.networks).forEach(function (key) {
            if (diff === 0 || (currentTime - Number(key)) < diff) {
                const network = exchange_artifact.networks[key]
                address = network.address
            }
        });
        return address
    }

    private logTransaction(transactionId: string, plant: string, price: number, amountKwh: number, date: Date): Observable<any> {
        const _self = this
        return _self.activeWallet()
            .mergeMap(data => _self.transactionsLog.log(plant, data, transactionId, price, amountKwh, date))
    }

    private getTransactionReceiptMined(txHash, interval) {
        const self_ = this;
        const transactionReceiptAsync = function (resolve, reject) {
            self_.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
                if (error) {
                    reject(error);
                } else if (receipt == null || receipt.blockNumber == null || receipt.blockNumber === '') {
                    setTimeout(
                        () => transactionReceiptAsync(resolve, reject),
                        interval ? interval : 500);
                } else {
                    resolve(receipt);
                }
            });
        };

        if (Array.isArray(txHash)) {
            return Promise.all(txHash.map(
                oneTxHash => self_.getTransactionReceiptMined(oneTxHash, interval)));
        } else if (typeof txHash === 'string') {
            return new Promise(transactionReceiptAsync);
        } else {
            throw new Error('Invalid Type: ' + txHash);
        }
    }

}
