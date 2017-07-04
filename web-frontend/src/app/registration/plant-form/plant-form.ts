import {Period} from "../../shared/period";
import {GeoLocation} from "../../shared/geo-location";

export enum PlantType {
  SOLAR,
  WIND,
  HYDRO
}

export class PlantForm {
  public name : string;
  public walletId : string;
  public areaCode : string;
  public capacity : number;
  public type : PlantType;
  public location : GeoLocation;
  public activePeriod : Period;

  constructor(
    name? : string,
    walletId? : string,
    areaName? : string,
    areaCode? : string,
    capacity? : number,
    type? : PlantType,
    location? : GeoLocation,
    activePeriod? : Period
  ) {
    this.name = name;
    this.walletId = walletId;
    this.areaCode = areaCode;
    this.capacity = capacity;
    this.type = type;
    this.location = location;
    this.activePeriod = activePeriod;
  }
}
