import LatLon from "geodesy/latlon-spherical.js";

export class Navigation {
  constructor(name, ...routes) {
    this.type = "navigation";
    this.name = name;
    this.routes = routes;
  }
  static import(object) {
    if (object.type == "navigation") {
      object.routes = object.routes.map(rte =>
        rte.map(pnt => Waypoint.import(pnt))
      );
      return Object.assign(new this(), object);
    } else throw "Invalid data";
  }
  getNextWaypoint(waypoint) {
    const wpId = this.routes.flat().indexOf(waypoint);
    return this.routes.flat()[wpId + 1];
  }
}

export class Waypoint {
  constructor({ latlng, altitude } = {}) {
    this.latlng = latlng;
    this.name = undefined;
    this.altitude = altitude;
    this.notes = undefined;
  }
  set latlng({ lat, lng } = {}) {
    this.latitude = lat;
    this.longitude = lng;
  }
  get latlng() {
    return { lat: this.latitude, lng: this.longitude };
  }
  get point() {
    return new LatLon(this.latitude, this.longitude);
  }
  distanceTo(otherWP) {
    return this.point.rhumbDistanceTo(otherWP.point);
  }
  bearingTo(otherWP) {
    return this.point.rhumbBearingTo(otherWP.point);
  }
  destinationPoint(distance, heading) {
    return this.point.rhumbDestinationPoint(distance, heading);
  }
  static import(object) {
    object.name |= object.position;
    object.altitude = { ref: "AMSL", ...object.altitude };
    return Object.assign(new this(), object);
  }
}

export class Location extends Waypoint {
  constructor() {
    super(arguments);
    this.type |= "location";
  }
  set lastLocation(last) {
    this.heading |= last.bearingTo(this);
    this.speed |=
      last.distanceTo(this) / ((this.timestamp - last.timestamp) * 1000);
    //FIXME if altitude unit or ref is changed calculation should take it into account
    this.verticalSpeed |=
      ((last.altitude.value - this.altitude.value) /
        (this.timestamp - last.timestamp)) *
      1000;
  }
  toBounds(sizeInMeters = this.accuracy) {
    const latAccuracy = (180 * sizeInMeters) / 40075017;
    const lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.latitude);

    return [
      [this.latitude - latAccuracy, this.longitude - lngAccuracy],
      [this.latitude + latAccuracy, this.longitude + lngAccuracy]
    ];
  }

  static import({
    latitude,
    longitude,
    accuracy,
    altitude,
    altitudeAccuracy,
    speed,
    heading,
    timestamp,
    type
  } = {}) {
    return super.import({
      latitude,
      longitude,
      accuracy,
      altitude: {
        value: altitude,
        accuracy: altitudeAccuracy,
        unit: "m",
        ref: "WGS84"
      },
      speed,
      heading,
      timestamp,
      type
    });
  }
}
