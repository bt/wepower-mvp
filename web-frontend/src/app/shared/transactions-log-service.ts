import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";


@Injectable()
export class TransactionsLogService {

    constructor(private http: Http) { }

    log(plant: string, consumer: string, transaction: string, amountEth: number, amountKwh: number, date: Date): Observable<any> {

        let body = {
            "plant": plant,
            "consumer":  consumer,
            "transactionId": transaction,
            "amountEth": amountEth,
            "amountKwh": amountKwh,
            "date": date
        }

        return this.http.post(`${environment.dataUrls.transactions.root}`, body)
            .map(() => null)
            .catch(this.handleError);
    }

    transactionsConsumer(from: string, date: Date): Observable<Array<number>> {
        return this.http.get(`
                ${environment.dataUrls.transactions.consumer}?consumer=${from}&date=${date.toISOString().split('T')[0]}`)
            .map(this.extractData)
            .catch(this.handleError)
    }

    transactionsPlant(to: string, date: Date): Observable<Array<number>> {
        return this.http.get(`
                ${environment.dataUrls.transactions.plant}?plant=${to}&date=${date.toISOString().split('T')[0]}`)
            .map(this.extractData)
            .catch(this.handleError)
    }


    private extractData(response: Response): Observable<Array<number>> {
        return response.json()
            .map(transaction => transaction.amountEth)
    }

    private handleError(error: Response): Observable<Array<number>> {
        console.error("Error while interacting with transactions log", error)
        return Observable.of([0])
    }

}
