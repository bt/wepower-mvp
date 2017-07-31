import { DayDataRow } from "app/shared/day-data-row";

export class PredictionData implements DayDataRow {

  constructor(
    public date : Date,
    public energyPrediction : number
  ) { }

  static emptyForDay(date : Date) : PredictionData {
    return new PredictionData(
      date,
      0
    )
  }
}
