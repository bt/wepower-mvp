export class Period {
  from : Date;
  to: Date;

  constructor(from?: Date, to?: Date) {
    this.from = from;
    this.to = to;
  }
}
