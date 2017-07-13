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
export class ProductionReviewService {

  constructor(private http : Http) { }

  getProductionDetails(wallet : string, period : Period) : Observable<Array<ProductionDetails>> {
    let params: URLSearchParams = new URLSearchParams()
    params.set('from', moment(period.from).format('YYYY-MM-DD'))
    params.set('to', moment(period.to).format('YYYY-MM-DD'))


    let requestOptions = new RequestOptions()
    requestOptions.params = params

    let plantUrl = environment.dataUrls.plant

    return this.http.get(`${plantUrl.root}/${wallet}/${plantUrl.productionReview}`, requestOptions)
      .map(this.extractData)
      .catch(this.handleError)
  }

  extractData(response : Response) : Observable<Array<ProductionDetails>> {
    return response.json()
      .map(dayReview => new ProductionDetails(
        new Date(dayReview.date[0], dayReview.date[1] - 1, dayReview.date[2]),
        dayReview.predictedAmount,
        dayReview.producedAmount)
      )
  }

  handleError(error : Response) : Observable<Array<ProductionDetails>> {
    return Observable.throw("Failed to get plant data")
  }

}
