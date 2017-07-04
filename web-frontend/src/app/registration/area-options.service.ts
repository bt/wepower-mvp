import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'


import { GeoArea } from "../shared/geo-area";
import { environment } from "../../environments/environment";


@Injectable()
export class AreaOptionsService {

  constructor(private http: Http) {}

  loadAvailableAreas(): Observable<Array<GeoArea>> {
    return this.http.get(`${environment.dataUrls.locationArea}`)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(response: Response): Observable<number> {
    return response.json().map(area => new GeoArea(area.name, area.code)) || {};
  }

  // TODO: Implement
  private handleError(error: Response): Observable<Array<GeoArea>> {
    return Observable.throw("Failed data loading")
  }
}
