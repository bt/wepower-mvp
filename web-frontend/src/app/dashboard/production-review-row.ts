import { DayDataRow } from "../shared/day-data-row";

export class ProductionReviewRow implements DayDataRow {
  constructor(public date: Date,
              public prediction: number,
              public production: number,
              public sold: number,
              public priceEth: number,
              public priceEur: number,
              public receivedEth: number,
              public totalTokens: number) {

  }

  public static emptyForDay(date: Date) {
    return new ProductionReviewRow(
      date,
      0,
      0,
      0,
      null,
      null,
      null,
      0)
  }
}
