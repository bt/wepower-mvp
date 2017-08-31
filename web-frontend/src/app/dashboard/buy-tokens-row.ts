import { DayDataRow } from "../shared/day-data-row";
import {PlantType} from "../registration/plant-form/plant-form";

export class BuyTokensRow implements DayDataRow {
  constructor(public date: Date,
              public tokens: number,
              public source: PlantType,
              public priceEth: number,
              public priceEur: number,
              public sum: number,
              public address: string,
              public bestPrice: boolean) {
  }

  public static emptyForDay(date: Date) {
    return new BuyTokensRow(
      date,
      0,
      0,
      0,
      null,
      null,
      null,
      false
    )
  }
}
