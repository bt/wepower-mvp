import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from "rxjs/Observable";

import * as moment from 'moment';

import { PredictionData } from "../prediction-review/prediction-data";
import { Period } from "../../shared/period";
import { environment } from "../../../environments/environment";


@Injectable()
export class ConsumptionPredictionService {

  constructor(private http : Http) { }

  getPrediction(walletAddress : string, period : Period) : Observable<Array<PredictionData>> {
    let urlData = environment.dataUrls.consumer;
    let requestOptions = this.buildPredictionFilterParams(period);

    return this.http
      .get(`${urlData.root}/${walletAddress}/${urlData.prediction}`, requestOptions)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(response : Response) : Observable<Array<PredictionData>> {
    return response.json()
      .map(prediction => new PredictionData(
        new Date(prediction.date),
        prediction.predictedAmount)
      );
  }

  getPredictionTotal(walletAddress : string, period : Period) : Observable<number> {
    let consumerUrl = environment.dataUrls.consumer;
    let requestOptions = this.buildPredictionFilterParams(period);

    return this.http
      .get(`${consumerUrl.root}/${walletAddress}/${consumerUrl.predictionTotal}`, requestOptions)
      .map(this.extractTotal)
      .catch(this.handleError)
  }

  private buildPredictionFilterParams(period: Period) {
    let params: URLSearchParams = new URLSearchParams();

    params.set('from', moment(period.from).format('YYYY-MM-DD'));
    params.set('to', moment(period.to).format('YYYY-MM-DD'));


    let requestOptions = new RequestOptions();
    requestOptions.params = params;
    return requestOptions;
  }

  private extractTotal(response : Response) : Observable<number> {
    return response.json()
  }

  private handleError() {
    return Observable.throw("Failed prediction");
  }
}
