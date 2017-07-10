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
      new Date(this.from.getTime() + (weekCount * millisInWeek)),
      new Date(this.to.getTime() + (weekCount * millisInWeek))
    )
  }
}
