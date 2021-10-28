import { Model } from "@/models/Base.js";
import { Altitude, Distance, Azimuth } from "@/models/Quantities.js";

import { point, round } from "@turf/helpers";
import rhumbDistance from "@turf/rhumb-distance";
import rhumbBearing from "@turf/rhumb-bearing";
import rhumbDestination from "@turf/rhumb-destination";

export class Waypoint extends Model {
  constructor([longitude, latitude, altitude] = [], properties = {}) {
    const coordinates = [round(longitude, 6), round(latitude, 6)];
    if (altitude !== undefined && !properties["altitude"]) {
      properties["altitude"] = new Altitude(altitude);
      coordinates.push(round(Number(altitude)));
    }
    super(point(coordinates, properties));
  }

  set longitude(val) {
    this.geometry.coordinates[0] = round(val, 6);
  }

  set latitude(val) {
    this.geometry.coordinates[1] = round(val, 6);
  }

  get altitude() {
    return this.properties.altitude;
  }

  set altitude(val) {
    this.geometry.coordinates[2] = round(val);
  }

  get lngLat() {
    return {
      lng: this.geometry.coordinates[0],
      lat: this.geometry.coordinates[1]
    };
  }

  set lngLat({ lng, lat }) {
    this.longitude = lng;
    this.latitude = lat;
  }

  distanceTo(wp) {
    return new Distance(
      round(
        rhumbDistance(this.geometry.coordinates, wp.geometry.coordinates, {
          units: "meters"
        })
      )
    );
  }

  bearingTo(wp) {
    return new Azimuth(
      rhumbBearing(this.geometry.coordinates, wp.geometry.coordinates),
      "°"
    );
  }

  destinationPoint(distance, heading) {
    const coords = rhumbDestination(
      this.geometry.coordinates,
      distance,
      heading.to("°"),
      {
        units: "meters"
      }
    ).geometry.coordinates;
    return new this.constructor(coords);
  }

  toGeoJSON(type) {
    switch (type) {
      case "Position":
        return this.geometry.coordinates;
      case "Point":
      default:
        return {
          ...this,
          type: "Feature"
        };
    }
  }

  static from({
    type,
    geometry,
    coordinates,
    latitude,
    longitude,
    altitude,
    lngLat,
    properties,
    ...otherProps
  }) {
    if (arguments[0] instanceof this) return arguments[0];

    switch (type) {
      case this.name:
        if (lngLat) {
          latitude || (latitude = lngLat.lat);
          longitude || (longitude = lngLat.lng);
        }
        if (altitude) altitude = Altitude.from(altitude);
        break;
      case "Feature":
        [longitude, latitude, altitude] = geometry.coordinates;
        break;
      case "Point":
        [longitude, latitude, altitude] = coordinates;
        break;
      default:
        throw `Invalid data : 'type' should be 'Feature' or 'Point' or '${this.name}' got '${type}'`;
    }

    return new this([longitude, latitude, altitude], {
      ...otherProps,
      ...properties
    });
  }
}
