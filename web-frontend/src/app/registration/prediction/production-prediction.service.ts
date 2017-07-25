import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from "rxjs/Observable";

import * as moment from 'moment';


import { Period } from "../../shared/period";
import { environment } from "../../../environments/environment";
import { PredictionData } from "../prediction-review/prediction-data";

@Injectable()
export class ProductionPredictionService {

  constructor(private http : Http,
              private datePipe : DatePipe) { }

  getPredictionData(walletAddress : string, period : Period) : Observable<Array<PredictionData>> {
    let urlData = environment.dataUrls.plant;
    let requestOptions = this.buildPredictionFilterParams(period);

    return this.http
      .get(`${urlData.root}/${walletAddress}/${urlData.predictionData}`, requestOptions)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(response : Response) : Array<PredictionData> {
    return response.json()
      .map(prediction => new PredictionData(
        new Date(prediction.date),
        prediction.predictedAmount)
      );
  }

  getPredictionTotal(walletAddress : string, period : Period) : Observable<number> {
    let urlData = environment.dataUrls.plant;
    let requestOptions = this.buildPredictionFilterParams(period);

    return this.http
      .get(`${urlData.root}/${walletAddress}/${urlData.predictionTotal}`, requestOptions)
      .map(this.extractTotal)
      .catch(this.handleError)
  }

  private extractTotal(response : Response) : number {
    return response.json();
  }

  getPredictedPeriod(wallet: string): Observable<Period> {
    let plantUrl = environment.dataUrls.plant;

    return this.http.get(`${plantUrl.root}/${wallet}/${plantUrl.predictionPeriod}`, null)
      .map(this.extractPeriod)
      .catch(this.handleError)
  }

  private extractPeriod(response : Response) : Period {
    let jsonBody = response.json()

    return new Period(new Date(jsonBody.from), new Date(jsonBody.to))
  }

  private buildPredictionFilterParams(period: Period) {
    let params: URLSearchParams = new URLSearchParams();

    params.set('from', moment(period.from).format('YYYY-MM-DD'));
    params.set('to', moment(period.to).format('YYYY-MM-DD'));

    let requestOptions = new RequestOptions();
    requestOptions.params = params;

    return requestOptions;
  }

  private handleError() {
    return Observable.throw("Failed prediction");
  }
}
