import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'

import * as moment from 'moment'

import {PlantForm, PlantType} from "./plant-form/plant-form";
import {environment} from "../../environments/environment";
import {ProductionPredictionService} from "./prediction/production-prediction.service"
import { EthereumService } from "../shared/ethereum.service";
import { BlockchainPlantData } from "../shared/blockchain-plant"
import {PredictionData} from "./prediction/prediction-data";

@Injectable()
export class PlantManagementService {

  constructor(
      private http: Http,
      private ethereumService: EthereumService,
      private predictionService: ProductionPredictionService) {
  }

  createPlant(plantData: PlantForm): Observable<number> {

    let body = {
      'name' : plantData.name,
      'walletId' : plantData.walletId,
      'areaCode' : plantData.areaCode,
      'type' : PlantType[plantData.type],
      'capacity' : plantData.capacity,
      'produceFrom' : moment().add(1, 'day').toDate(),
      'produceTo' : moment().add(1, 'month').add(1, 'day').toDate()
    }

    return this.http.post(`${environment.dataUrls.plant.root}`, body)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(response: Response): Observable<number> {
      return response.json()
  }

  activatePlant(wallet: string): Observable<any> {

    let plantUrl = environment.dataUrls.plant;

    return this.getBlockchainData(wallet)
        .mergeMap(data => this.ethereumService.registerPlant(wallet, data))
        .mergeMap(data => this.http.post(`${plantUrl.root}/${wallet}/${plantUrl.activate}`, null))
        .catch(error => Observable.throw(error))
  }

  private getBlockchainData(wallet: string): Observable<BlockchainPlantData> {
      return this.http.get(`${environment.dataUrls.plant.root}/${wallet}/${environment.dataUrls.plant.blockchainData}`)
        .map(this.extractBlockchainData)
  }

  private extractBlockchainData(response: Response): BlockchainPlantData {
    let preditionData = response.json().predictions.map(predition => new PredictionData(new Date(predition.date), predition.predictedAmount));
    return new BlockchainPlantData(response.json().currentMarketPrice, PlantType[PlantType[response.json().plant.type]], preditionData)
  }


  // TODO: Implement
  private handleError(error: Response): Observable<number> {
    return Observable.throw("Failed data update")
  }
}
