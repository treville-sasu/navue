import { Model } from "@/models/Base.js";

import { point, round } from "@turf/helpers";
import rhumbDistance from "@turf/rhumb-distance";
import rhumbBearing from "@turf/rhumb-bearing";
import rhumbDestination from "@turf/rhumb-destination";

export class Position extends Model {
  constructor([longitude, latitude] = [], properties = {}) {
    const coordinates = [round(longitude, 6), round(latitude, 6)];
    super(point(coordinates, properties));
  }

  set longitude(val) {
    this.geometry.coordinates[0] = round(val, 6);
  }

  set latitude(val) {
    this.geometry.coordinates[1] = round(val, 6);
  }

  distanceTo(position) {
    return round(
      rhumbDistance(this.geometry.coordinates, position.geometry.coordinates, {
        units: "meters"
      })
    );
  }

  bearingTo(position) {
    return rhumbBearing(
      this.geometry.coordinates,
      position.geometry.coordinates
    );
  }

  destinationPoint(distance, heading) {
    const coords = rhumbDestination(
      this.geometry.coordinates,
      distance,
      heading,
      {
        units: "meters"
      }
    ).geometry.coordinates;
    return new this.constructor(coords);
  }

  toGeoJSON(type) {
    switch (type) {
      case "Point":
        return this.geometry;
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
    properties = {},
    ...otherProps
  } = {}) {
    if (arguments[0] instanceof this) return arguments[0];

    switch (type) {
      case this.name:
      case "Feature":
        if (geometry && geometry.type == "Point")
          coordinates = geometry.coordinates;
        else
          throw `Invalid data : 'geometry.type' should be 'Point' got '${geometry &&
            geometry.type}'`;
        break;
      case "Point":
        // coordinates = coordinates;
        break;
      default:
        throw `Invalid data : 'type' should be 'Feature', 'Point' or '${this.name}' got '${type}'`;
    }
    return new this(coordinates, {
      ...otherProps,
      ...properties
    });
  }
}
