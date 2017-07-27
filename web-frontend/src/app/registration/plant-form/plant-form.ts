
export enum PlantType {
  SOLAR,
  WIND,
  HYDRO
}

export class PlantForm {
  public name : string;
  public walletId : string;
  public areaCode : string;
  public areaName : string;
  public capacity : number;
  public type : PlantType;

  constructor(
    name? : string,
    walletId? : string,
    areaName? : string,
    areaCode? : string,
    capacity? : number,
    type? : PlantType,
  ) {
    this.name = name;
    this.walletId = walletId;
    this.areaCode = areaCode;
    this.capacity = capacity;
    this.type = type;
  }
}
