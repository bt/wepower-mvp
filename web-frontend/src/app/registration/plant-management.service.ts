import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {PlantForm} from "./plant-form/plant-form";
import {environment} from "../../environments/environment";

@Injectable()
export class PlantManagementService {

  constructor(private http: Http) {
  }

  createPlant(plantData: PlantForm): Observable<number> {
    return this.http.post(`${environment.dataUrls.plant}`, plantData)
      .map(this.extractData)
      .catch(this.handleError)
  }

  extractData(response: Response): Observable<number> {
    return response.json()
  }

  // TODO: Implement
  private handleError(error: Response): Observable<number> {
    return Observable.throw("Failed data update")
  }
}
