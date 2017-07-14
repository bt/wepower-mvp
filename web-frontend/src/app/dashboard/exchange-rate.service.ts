import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'
import {environment} from "../../environments/environment";

@Injectable()
export class ExchangeRateService {

  constructor(private http : Http) { }

  exchangeRate() : Observable<number> {
    return this.http.get(`${environment.dataUrls.market.ethereumPrice}`)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(response: Response): Observable<number> {
    console.log(response.json())
    return response.json()
  }

  // TODO: Implement
  private handleError(error: Response): Observable<number> {
    return Observable.throw("Failed ethereum rate request")
  }
}
