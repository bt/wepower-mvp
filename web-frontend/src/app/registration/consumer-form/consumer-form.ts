export class ConsumerForm {
  public walletId : string;
  public areaName : string;
  public areaCode : string;
  public meterId : number;
  public consumption : number;
  public houseSizeCode : string;

  constructor(walletId?: string, areaName?: string, meterId?: number, consumption?: number, houseSizeCode?: string) {
    this.walletId = walletId;
    this.areaName = areaName;
    this.meterId = meterId;
    this.consumption = consumption;
    this.houseSizeCode = houseSizeCode;
  }
}
