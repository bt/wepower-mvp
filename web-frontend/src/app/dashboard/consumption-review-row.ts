import { DayDataRow } from "../shared/day-data-row";

export class ConsumptionReviewRow implements DayDataRow {
  constructor(public date : Date,
              public prediction : number,
              public consumed : number,
              public priceEth : number,
              public priceEur : number,
              public paidEth : number) {

  }

  public static emptyForDay(date : Date) {
    return new ConsumptionReviewRow(
      date,
      0,
      0,
      null,
      null,
      null
    )
  }
}
