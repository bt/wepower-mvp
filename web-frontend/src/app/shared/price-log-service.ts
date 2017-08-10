import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import {Period} from "app/shared/period";

import * as moment from 'moment';


@Injectable()
export class PriceLogService {

    constructor(private http: Http) { }

    log(wallet: string, price: number): Observable<any> {

        let body = {
            "plant": wallet,
            "price": price,
            "date": new Date().toISOString().split('T')[0]
        }

        return this.http.post(`${environment.dataUrls.prices.root}`, body)
            .map(() => null)
            .catch(this.handleError);
    }

    getForPeriod(wallet: string, period: Period): Observable<Array<[Date, number]>> {
        const requestOptions = this.buildPeriodFilterParams(wallet, period)
        return this.http.get(`${environment.dataUrls.prices.dates}`, requestOptions)
            .map(this.extractData)
            .catch(error => Observable.throw("Failed to get plant data", error))
    }

    private extractData(response: Response): Observable<Array<[Date, number]>> {
        return response.json()
            .map(priceForDay =>
                [
                    new Date(priceForDay.date),
                    priceForDay.price
                ]
            )
    }

    private buildPeriodFilterParams(wallet: string, period: Period) {
        let params: URLSearchParams = new URLSearchParams()

        params.set('plant', wallet)
        params.set('from', moment(period.from).format('YYYY-MM-DD'))
        params.set('to', moment(period.to).format('YYYY-MM-DD'))


        let requestOptions = new RequestOptions()
        requestOptions.params = params
        return requestOptions
    }

    private handleError(error: Response): Observable<Array<number>> {
        console.error("Error while interacting with prices log", error)
        return Observable.of([0])
    }

}
