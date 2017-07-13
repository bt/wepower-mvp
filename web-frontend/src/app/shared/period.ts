import * as moment from 'moment';

export class Period {

  from : Date;
  to: Date;

  constructor(from?: Date, to?: Date) {
    this.from = from;
    this.to = to;
  }

  plusWeeks(weekCount : number) : Period {

    const millisInWeek = 7 * 24 * 3600 * 1000;

    return new Period(
      moment(this.from).add(weekCount, 'week').toDate(),
      moment(this.to).add(weekCount, 'week').toDate()
    )
  }
}
