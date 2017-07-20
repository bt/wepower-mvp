import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import {PlantForm, PlantType} from "./plant-form/plant-form";
import {environment} from "../../environments/environment";

@Injectable()
export class PlantManagementService {

  constructor(private http: Http) {
  }

  createPlant(plantData: PlantForm): Observable<number> {

    let body = {
      'name' : plantData.name,
      'walletId' : plantData.walletId,
      'areaCode' : plantData.areaCode,
      'type' : PlantType[plantData.type],
      'capacity' : plantData.capacity,
      'locationLatitude' : plantData.location.latitude,
      'locationLongtitude' : plantData.location.longtitude,
      'produceFrom' : plantData.activePeriod.from,
      'produceTo' : plantData.activePeriod.to
    }

    return this.http.post(`${environment.dataUrls.plant.root}`, body)
      .map(this.extractData)
      .catch(this.handleError)
  }

  activatePlant(wallet: string): Observable<any> {
    let plantUrl = environment.dataUrls.plant;

    return this.http.post(`${plantUrl.root}/${wallet}/${plantUrl.activate}`, null)
      .map(() => null)
      .catch(this.handleError)
  }

  private extractData(response: Response): Observable<number> {
    return response.json()
  }

  // TODO: Implement
  private handleError(error: Response): Observable<number> {
    return Observable.throw("Failed data update")
  }
}
