export class ConsumerForm {
  public walletId : string;
  public areaCode : string;
  public counterId : number;
  public consumption : number;
  public houseSizeCode : string;

  constructor(walletId?: string, areaCode?: string, counterId?: number, consumption?: number, houseSizeCode?: string) {
    this.walletId = walletId;
    this.areaCode = areaCode;
    this.counterId = counterId;
    this.consumption = consumption;
    this.houseSizeCode = houseSizeCode;
  }
}
