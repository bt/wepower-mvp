import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import { ConsumerForm } from "./consumer-form/consumer-form";
import { environment } from "../../environments/environment";

@Injectable()
export class ConsumerManagementService {

  constructor(private http: Http) { }

  createConsumer(plantData : ConsumerForm): Observable<number> {
    return this.http.post(`${environment.dataUrls.consumer.root}`, plantData)
      .map(this.extractData)
      .catch(this.handleError)
  }

  // TODO: Implement
  private extractData(response: Response): Observable<number> {
    return response.json()
  }

  // TODO: Implement
  private handleError(error: Response): Observable<number> {
    return Observable.throw("Failed data update")
  }
}
