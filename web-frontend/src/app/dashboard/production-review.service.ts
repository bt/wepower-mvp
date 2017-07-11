import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'
import {Period} from "../shared/period";
import {ProductionReviewRow} from "./production-review-row";
import {environment} from "../../environments/environment";
import {ProductionDetails} from "./production-details";

@Injectable()
export class ProductionReviewService {

  constructor(private http : Http,
              private datePipe : DatePipe) { }

  getProductionDetails(wallet : string, period : Period) : Observable<Array<ProductionDetails>> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('from', this.datePipe.transform(period.from, 'yyyy-MM-dd'));
    params.set('to', this.datePipe.transform(period.to, 'yyyy-MM-dd'));


    let requestOptions = new RequestOptions();
    requestOptions.params = params;

    let plantUrl = environment.dataUrls.plant;

    return this.http.get(`${plantUrl.root}/${wallet}/${plantUrl.productionReview}`, requestOptions)
      .map(this.extractData)
      .catch(this.handleError)
  }

  extractData(response : Response) : Observable<Array<ProductionDetails>> {
    return response.json()
      .map(dayReview => new ProductionDetails(
        dayReview.date,
        dayReview.predictedAmount,
        dayReview.producedAmount)
      )
  }

  handleError(error : Response) : Observable<Array<ProductionDetails>> {
    return Observable.throw("Failed to get plant data");
  }

}
