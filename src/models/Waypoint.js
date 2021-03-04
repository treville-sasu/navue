import { Model } from "@/models/Base.js";
import { Altitude } from "@/models/Quantities.js";
import LatLon from "geodesy/latlon-spherical.js";

export class Waypoint extends Model {
  constructor({ name, latitude, longitude, altitude, notes, latlng } = {}) {
    if (altitude) altitude = Altitude.from(altitude);
    super({ name, latitude, longitude, altitude, notes });
    if (latlng) this.latlng = latlng;
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

  toGeoJSON() {
    // eslint-disable-next-line no-unused-vars
    const { latitude, longitude, ...properties } = { ...this };
    return {
      type: "Feature",
      properties,
      geometry: this.point.toGeoJSON()
    };
    // or with : https://www.npmjs.com/package/geojson >>>> GeoJSON.parse(data, { Point: ['lat', 'lng'] });
  }

  static from(object) {
    object.name |= object.position;
    object.altitude = Altitude.form(object.altitude);
    return super.import(object);
  }
}

export class Location extends Waypoint {
  constructor({
    name,
    latitude,
    longitude,
    altitude,
    notes,
    latlng,
    accuracy,
    heading,
    speed,
    timestamp
  } = {}) {
    super({ name, latitude, longitude, altitude, notes, latlng });
    this.type = "location";
    this.timestamp = timestamp;
    this.accuracy = accuracy;
    if (heading) this.heading = heading % 360;
    // TODO: set speed object
    this.speed = speed;
  }

  computeMovementFrom(last) {
    this.heading = last.bearingTo(this);

    this.speed =
      (this.distanceTo(last) / (this.timestamp - last.timestamp)) * 1000;

    this.verticalSpeed =
      ((this.altitude.value - last.altitude.value) /
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

  static from({
    latitude,
    longitude,
    accuracy,
    altitude,
    altitudeAccuracy,
    speed,
    heading,
    timestamp
  } = {}) {
    return new this({
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
      timestamp
    });
  }
}
