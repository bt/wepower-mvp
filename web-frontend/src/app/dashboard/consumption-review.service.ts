import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import * as moment from 'moment';

import { Period } from "../shared/period";
import { environment } from "../../environments/environment";
import {ConsumptionDetails} from "./consumption-details";

@Injectable()
export class ConsumptionReviewService {

  constructor(private http : Http,
              private datePipe : DatePipe) { }

  getConsumptionDetails(wallet : string, period : Period) : Observable<Array<ConsumptionDetails>> {
    let plantUrl = environment.dataUrls.consumer
    let requestOptions = this.buildPredictionFilterParams(period)

    return this.http.get(`${plantUrl.root}/${wallet}/${plantUrl.consumptionReview}`, requestOptions)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(response : Response) : Observable<Array<ConsumptionDetails>> {
    return response.json()
      .map(dayReview => new ConsumptionDetails(
        new Date(dayReview.date[0], dayReview.date[1] - 1, dayReview.date[2]),
        dayReview.predictedAmount,
        dayReview.consumedAmount)
      )
  }

  private handleError(error : Response) : Observable<Array<ConsumptionDetails>> {
    return Observable.throw("Failed to get plant data")
  }

  private buildPredictionFilterParams(period: Period) {
    let params: URLSearchParams = new URLSearchParams()

    params.set('from', moment(period.from).format('YYYY-MM-DD'))
    params.set('to', moment(period.to).format('YYYY-MM-DD'))


    let requestOptions = new RequestOptions()
    requestOptions.params = params
    return requestOptions
  }

}
