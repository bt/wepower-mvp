import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";


@Injectable()
export class TransactionsLogService {

    constructor(private http: Http) { }

    log(from: string, to: string, transaction: string, amount: number): void {

        let body = {
            "from": from,
            "to":  to,
            "transactionId": transaction,
            "amount": amount,
            "date": new Date().toString()
        }

        this.http.post(`${environment.dataUrls.transactions.root}`, body)
            .catch(this.handleError);
    }

    transactionsFrom(from: string, date: Date): Observable<Array<number>> {
        return this.http.get(`
                ${environment.dataUrls.transactions.root}/
                ${environment.dataUrls.transactions.from}/
                ${from}/
                ${date.toString()}`)
            .map(this.extractData)
            .catch(this.handleError)
    }

    transactionsTo(to: string, date: Date): Observable<Array<number>> {
        return this.http.get(`
                ${environment.dataUrls.transactions.root}/
                ${environment.dataUrls.transactions.to}/
                ${to}/
                ${date.toString()}`)
            .map(this.extractData)
            .catch(this.handleError)
    }


    private extractData(response: Response): Observable<Array<number>> {
        return response.json()
            .map(transaction => transaction.amount)
    }

    private handleError(error: Response): Observable<Array<number>> {
        return Observable.throw("Error while interacting with transactions log")
    }

}
