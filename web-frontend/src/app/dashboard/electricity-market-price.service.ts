import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import * as moment from 'moment';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'
import {Period} from "../shared/period";
import {environment} from "../../environments/environment";
import {ProductionDetails} from "./production-details";

@Injectable()
export class ElectricityMarketPriceService {

  constructor(private http : Http) { }

  getElectricityPrices(period : Period) : Observable<Array<[Date, number]>> {
    let requestOptions = this.buildPeriodFilterParams(period)

    return this.http.get(`${environment.dataUrls.market.electricityPrice}`, requestOptions)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(response : Response) : Observable<Array<[Date, number]>> {
    return response.json()
      .map(priceForDay =>
        [
          new Date(priceForDay.date),
          priceForDay.price
        ]
      )
  }

  private handleError(error : Response) : Observable<Array<[Date, number]>> {
    return Observable.throw("Failed to get plant data")
  }

  private buildPeriodFilterParams(period: Period) {
    let params: URLSearchParams = new URLSearchParams()

    params.set('from', moment(period.from).format('YYYY-MM-DD'))
    params.set('to', moment(period.to).format('YYYY-MM-DD'))


    let requestOptions = new RequestOptions()
    requestOptions.params = params
    return requestOptions
  }

}
