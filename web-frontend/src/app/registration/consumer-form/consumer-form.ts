export class ConsumerForm {
  public walletId : string;
  public areaCode : string;
  public meterId : number;
  public consumption : number;
  public houseSizeCode : string;

  constructor(walletId?: string, areaCode?: string, meterId?: number, consumption?: number, houseSizeCode?: string) {
    this.walletId = walletId;
    this.areaCode = areaCode;
    this.meterId = meterId;
    this.consumption = consumption;
    this.houseSizeCode = houseSizeCode;
  }
}
