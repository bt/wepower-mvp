import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from "rxjs/Observable";

import { Period } from "../../shared/period";
import { environment } from "../../../environments/environment";
import { PredictionData } from "../prediction-review/prediction-data";

@Injectable()
export class ProductionPredictionService {

  constructor(private http : Http,
              private datePipe : DatePipe) { }

  getPredictionData(walletAddress : string, period : Period) : Observable<Array<PredictionData>> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('from', this.datePipe.transform(period.from, 'yyyy-MM-dd'));
    params.set('to', this.datePipe.transform(period.to, 'yyyy-MM-dd'));


    let requestOptions = new RequestOptions();
    requestOptions.params = params;

    let urlData = environment.dataUrls.plant;

    return this.http
      .get(`${urlData.root}/${walletAddress}/${urlData.predictionData}`, requestOptions)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(response : Response) : Observable<Array<PredictionData>> {
    return response.json()
      .map(prediction => new PredictionData(prediction.date, prediction.predictedAmount));
  }

  getPredictionTotal(walletAddress : string, period : Period) : Observable<number> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('from', this.datePipe.transform(period.from, 'yyyy-MM-dd'));
    params.set('to', this.datePipe.transform(period.to, 'yyyy-MM-dd'));


    let requestOptions = new RequestOptions();
    requestOptions.params = params;

    let urlData = environment.dataUrls.plant;

    return this.http
      .get(`${urlData.root}/${walletAddress}/${urlData.predictionTotal}`, requestOptions)
      .map(this.extractTotal)
      .catch(this.handleError)
  }

  private extractTotal(response : Response) : Observable<number> {
    console.log(response.json())
    return response.json();
  }


  private handleError() {
    return Observable.throw("Failed prediction");
  }
}
