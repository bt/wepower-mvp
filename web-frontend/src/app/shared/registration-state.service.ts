import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';


import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw'
import 'rxjs/add/observable/of'

import { environment } from "../../environments/environment";
import { WalletType } from "./wallet-type.enum";
import { WalletDetails } from "../dashboard/wallet-details";
import { PlantType } from "../registration/plant-form/plant-form";


@Injectable()
export class RegistrationStateService {
  constructor(private http: Http) { }

  isActive(wallet: string, type: string): Observable<boolean> {
    return this.http.get(`${environment.dataUrls.wallet.root}/${wallet}`)
      .map(details => this.extractActive(details, type))
      .catch(response => {
        return Observable.of(false)
      })
  }

  getActiveWalletDetails(wallet: string): Observable<WalletDetails> {
    return this.http.get(`${environment.dataUrls.wallet.root}/${wallet}`)
      .map(response => this.extractType(response, wallet))
      .catch(response => {
        console.error(response)
        return Observable.of(null)
      })
  }

  private extractActive(response: Response, requiredType: String): boolean {
    return response.json().type == requiredType && response.json().active == true
  }

  private extractType(response: Response, walletId: string): WalletDetails {
    let body = response.json()

    if (!body.active && body.type !== 'PLANT') {
      return null
    }

    let plantType = PlantType[<string> response.json().productionType]
    let responseWalletType = <string> response.json().type

    return new WalletDetails(walletId, WalletType[responseWalletType], plantType)
  }
}
