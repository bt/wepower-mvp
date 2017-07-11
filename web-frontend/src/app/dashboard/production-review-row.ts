export class ProductionReviewRow {
  constructor(private date : Date,
              private prediction : number,
              private production : number,
              private sold : number,
              private priceEth : number,
              private priceEur : number,
              private receivedEth : number) {

  }
}
