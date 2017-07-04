export class GeoLocation {
  longtitude : number;
  latitude : number;

  constructor(
    latitude? : number,
    longtitude? : number
  ) {
    this.latitude = latitude;
    this.longtitude = longtitude;
  }
}
