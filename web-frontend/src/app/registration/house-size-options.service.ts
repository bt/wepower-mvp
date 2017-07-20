import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'


import { HouseSize } from "../shared/house-size";
import { environment } from "../../environments/environment";



@Injectable()
export class HouseSizeOptionsService {

  constructor(private http: Http) { }

  loadAvailableSizes(): Observable<Array<HouseSize>> {
    return this.http.get(`${environment.dataUrls.houseSize}`)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(response: Response): Observable<Array<HouseSize>> {
    return response.json()
        .map(size => new HouseSize(size.sizeCode, size.shortDescription));
  }

  // TODO: Implement
  private handleError(error: Response): Observable<Array<HouseSize>> {
    return Observable.throw("Failed data loading")
  }
}
