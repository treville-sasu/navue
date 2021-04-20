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

  distanceTo(otherWP) {
    return new Distance(this.point.rhumbDistanceTo(otherWP.point), "m");
  }

  bearingTo(otherWP) {
    return new Azimuth(this.point.rhumbBearingTo(otherWP.point), "°", {
      _precision: 3
    });
  }

  destinationPoint(distance, heading) {
    let point = this.point.rhumbDestinationPoint(distance, heading);
    return new this.constructor(point.lat, point.lng);
  }

  toGeoJSON() {
    // eslint-disable-next-line no-unused-vars
    const { latitude, longitude, ...properties } = this;
    return {
      type: "Feature",
      properties,
      geometry: this.point.toGeoJSON()
    };
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
    { accuracy, verticalSpeed, speed, heading, timestamp, ...properties } = {}
  ) {
    super(latitude, longitude, altitude, {
      accuracy,
      verticalSpeed,
      speed,
      heading,
      timestamp,
      ...properties
    });
  }

  _delayFrom(other) {
    return this.timestamp - other.timestamp;
  }

  _climbFrom(other) {
    return this.altitude - other.altitude;
  }

  _speedFrom(other) {
    try {
      if (this._delayFrom(other) == 0)
        throw "Teleportation is not yet a possibility";
      return new Speed(
        (this.distanceTo(other) / this._delayFrom(other)) * 1000
      );
    } catch {
      return undefined;
    }
  }

  _verticalSpeedFrom(other) {
    try {
      if (this._delayFrom(other) == 0)
        throw "Teleportation is not yet a possibility";
      return new Speed(
        (this._climbFrom(other) / this._delayFrom(other)) * 1000
      );
    } catch {
      return undefined;
    }
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

  static from({
    accuracy,
    verticalSpeed,
    speed,
    heading,
    timestamp,
    ...waypoint
  } = {}) {
    //TODO accuracy should be a Distance.
    if (verticalSpeed) verticalSpeed = Speed.from(verticalSpeed);
    if (speed) speed = Speed.from(speed);
    if (heading) heading = Azimuth.from(heading);

    return super.from({
      ...waypoint,
      accuracy,
      verticalSpeed,
      speed,
      heading,
      timestamp
    });
  }

  static fromGeolocationPosition({
    coords: {
      latitude,
      longitude,
      altitude,
      accuracy,
      altitudeAccuracy,
      heading,
      speed
    },
    timestamp
  }) {
    if (altitude)
      altitude = new Altitude(altitude, "m", {
        reference: "WGS84",
        accuracy: altitudeAccuracy
      });
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
