import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from "rxjs/Observable";


import { PredictionData } from "../prediction-review/prediction-data";
import { Period } from "../../shared/period";
import { environment } from "../../../environments/environment";


@Injectable()
export class ConsumptionPredictionService {

  constructor(private http : Http,
              private datePipe : DatePipe) { }

  getPrediction(walletAddress : string, period : Period) : Observable<Array<PredictionData>> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('from', this.datePipe.transform(period.from, 'yyyy-MM-dd'));
    params.set('to', this.datePipe.transform(period.to, 'yyyy-MM-dd'));

    let requestOptions = new RequestOptions();
    requestOptions.params = params;

    let urlData = environment.dataUrls.consumer;

    return this.http
      .get(`${urlData.root}/${walletAddress}/${urlData.prediction}`, requestOptions)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(response : Response) : Observable<Array<PredictionData>> {
    return response.json()
      .map(prediction => new PredictionData(prediction.date, prediction.predictedAmount));
  }

  private handleError() : Observable<Array<PredictionData>> {
    return Observable.throw("Failed prediction");
  }
}
