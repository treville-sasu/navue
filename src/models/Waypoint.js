import { Model } from "@/models/Base.js";
import { Altitude, Distance, Azimuth } from "@/models/Quantities.js";

import { point, round } from "@turf/helpers";
import rhumbDistance from "@turf/rhumb-distance";
import rhumbBearing from "@turf/rhumb-bearing";
import rhumbDestination from "@turf/rhumb-destination";
import truncate from "@turf/truncate";
import greatCircle from "@turf/great-circle";

export class Waypoint extends Model {
  constructor([longitude, latitude, altitude] = [], properties = {}) {
    const coordinates = [round(longitude, 6), round(latitude, 6)];

    if (altitude !== undefined && !properties["altitude"]) {
      properties["altitude"] = new Altitude(altitude, "m", {
        reference: "WGS84"
      });
    } else if (properties["altitude"]) {
      properties["altitude"] = Altitude.from(properties["altitude"]);
      altitude = round(Number(altitude));
    }

    if (altitude) coordinates.push(round(Number(altitude)));
    super(point(coordinates, properties));
  }

  set longitude(val) {
    this.geometry.coordinates[0] = round(val, 6);
  }

  set latitude(val) {
    this.geometry.coordinates[1] = round(val, 6);
  }

  get altitude() {
    return this.geometry.coordinates[2];
  }

  set altitude(val) {
    this.geometry.coordinates[2] = round(val);
    this.properties.altitude = val;
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

  greatCircleTo(wp, properties) {
    let gc = truncate(
      greatCircle(this.geometry.coordinates, wp.geometry.coordinates, {
        npoints: 8,
        properties
      })
    );

    gc.properties = {
      ...gc.properties,
      distance: this.distanceTo(wp),
      bearing: this.bearingTo(wp)
    };

    return gc;
  }

  destinationPoint(distance, heading, properties) {
    const coords = rhumbDestination(
      this.geometry.coordinates,
      new Distance(distance),
      new Azimuth(heading).to("°"),
      {
        units: "meters"
      }
    ).geometry.coordinates;
    if (this.geometry.coordinates[2]) coords[2] = this.geometry.coordinates[2];
    return new this.constructor(coords, properties);
  }

  toGeoJSON(type) {
    switch (type) {
      case "Position":
        return this.geometry.coordinates;
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

  static fromEvent({ lngLat: { lng, lat } } = {}) {
    return new this([lng, lat]);
  }
}
