import { Model } from "@/models/Base.js";
import { Altitude, Distance, Speed, Azimuth } from "@/models/Quantities.js";
import LatLon from "geodesy/latlon-spherical.js";

export class Waypoint extends Model {
  constructor(latitude, longitude, altitude, properties = {}) {
    if (altitude && !(altitude instanceof Altitude))
      altitude = new Altitude(altitude);
    super({ latitude, longitude, altitude, ...properties });
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

  distanceTo(otherWP, properties) {
    return new Distance(
      this.point.rhumbDistanceTo(otherWP.point),
      "m",
      properties
    );
  }

  bearingTo(otherWP, properties) {
    return new Azimuth(
      this.point.rhumbBearingTo(otherWP.point),
      "°",
      properties
    );
  }

  destinationPoint(distance, heading) {
    let point = this.point.rhumbDestinationPoint(distance, heading);
    return new this.constructor(point.lat, point.lng);
  }

  toGeoJSON(type = "Feature") {
    const { latitude, longitude, altitude, ...properties } = this;
    switch (type) {
      case "Feature":
        return {
          type,
          properties: { ...properties, altitude: altitude.toJSON() },
          geometry: this.toGeoJSON("Point")
        };
      case "Point":
        return {
          type,
          coordinates: this.toGeoJSON("Position")
        };
      case "Position":
        return [latitude, longitude, Number(altitude)];
      default:
        throw "not a valid GeoJSON object";
    }
    // or with : https://www.npmjs.com/package/geojson >>>> GeoJSON.parse(data, { Point: ['lat', 'lng'] });
  }

  static from({ type, latitude, longitude, altitude, latlng, ...properties }) {
    if (arguments[0] instanceof this) return arguments[0];
    else if (type != this.name)
      throw `Invalid data : 'type' should be '${this.name}' got '${type}'`;

    if (altitude) altitude = Altitude.from(altitude);
    if (latlng) {
      latitude = latitude || latlng.lat;
      longitude = longitude || latlng.lng;
    }

    return new this(latitude, longitude, altitude, properties);
  }
}

export class Location extends Waypoint {
  constructor(
    latitude,
    longitude,
    altitude,
    { accuracy, speed, heading, timestamp, ...properties } = {}
  ) {
    super(latitude, longitude, altitude, {
      accuracy,
      speed,
      heading,
      timestamp,
      ...properties
    });
  }

  _delayFrom({ timestamp }) {
    return this.timestamp - timestamp;
  }

  _climbFrom({ altitude }) {
    return this.altitude - altitude;
  }

  _speedFrom(other) {
    if (this._delayFrom(other) == 0)
      throw "Teleportation is not yet a possibility";
    return new Speed((this.distanceTo(other) / this._delayFrom(other)) * 1000);
  }

  _verticalSpeedFrom(other) {
    if (this._delayFrom(other) == 0)
      throw "Teleportation is not yet a possibility";
    return new Speed((this._climbFrom(other) / this._delayFrom(other)) * 1000);
  }

  movementFrom(other) {
    return {
      speed: this._speedFrom(other),
      verticalSpeed: this._verticalSpeedFrom(other),
      heading: other.bearingTo(this)
    };
  }

  toBounds(sizeInMeters = this.accuracy) {
    const latAccuracy = (180 * sizeInMeters) / 40075017;
    const lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.latitude);

    return [
      [this.latitude - latAccuracy, this.longitude - lngAccuracy],
      [this.latitude + latAccuracy, this.longitude + lngAccuracy]
    ];
  }

  positionInSeconds(delay, heading = this.heading) {
    if (this.speed && heading)
      return this.destinationPoint(this.speed * delay, heading.value);
    else
      throw "cannot calculate futur position, speed & heading should be provided";
  }

  static from({ accuracy, speed, heading, timestamp, ...waypoint } = {}) {
    if (arguments[0] instanceof this) return arguments[0];

    if (accuracy) accuracy = Distance.from(accuracy);
    if (speed) speed = Speed.from(speed);
    if (heading) heading = Azimuth.from(heading);

    delete waypoint._id;
    delete waypoint._rev;

    return super.from({
      ...waypoint,
      accuracy,

      speed,
      heading,
      timestamp
    });
  }

  static fromGeolocationPosition(position) {
    let altitude, speed, heading, accuracy;

    if (position.coords.altitude)
      altitude = new Altitude(position.coords.altitude, "m", {
        reference: "WGS84",
        accuracy: position.coords.altitudeAccuracy
      });

    if (position.coords.accuracy)
      accuracy = new Distance(position.coords.accuracy, "m");
    if (position.coords.speed) speed = new Speed(position.coords.speed, "m/s");
    if (position.coords.heading)
      heading = new Azimuth(position.coords.heading, "°");

    return this.from({
      type: "Location",
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy,
      altitude,
      speed,
      heading,
      timestamp: position.timestamp
    });
  }

  static fromLocate({
    latitude,
    longitude,
    accuracy,
    altitude,
    altitudeAccuracy,
    speed,
    heading,
    timestamp
  }) {
    if (altitude)
      altitude = new Altitude(altitude, "m", {
        reference: "WGS84",
        accuracy: altitudeAccuracy
      });
    if (accuracy) accuracy = new Distance(accuracy, "m");
    if (speed) speed = new Speed(speed, "m/s");
    if (heading) heading = new Azimuth(heading, "°");

    return this.from({
      type: "Location",
      latitude,
      longitude,
      accuracy,
      altitude,
      speed,
      heading,
      timestamp
    });
  }
}
