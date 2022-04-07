import { Waypoint } from "@/models/Waypoint.js";

import bbox from "@turf/bbox";
import buffer from "@turf/buffer";

export class Location extends Waypoint {
  get bbox() {
    return bbox(
      buffer(this.toGeoJSON(), Number(this.properties.accuracy), {
        units: "meters",
      })
    );
  }

  get moving() {
    return this.properties.speed && this.properties.heading;
  }

  bounds(radius) {
    return bbox(
      buffer(this.toGeoJSON(), radius, {
        units: "meters",
      })
    );
  }

  legFrom(other) {
    return {
      distance: other.distanceTo(this),
      heading: other.bearingTo(this),
      speed: this._speedFrom(other),
      verticalSpeed: this._verticalSpeedFrom(other),
    };
  }

  willBeIn(delay, properties) {
    if (this.moving)
      return this.destinationPoint(
        this.properties.speed * delay,
        this.properties.heading,
        properties
      );
    else
      throw "cannot calculate futur position, speed & heading should be provided";
  }

  _delayFrom({ properties: { timestamp } }) {
    return (this.properties.timestamp - timestamp) / 1000;
  }

  _climbFrom({ properties: { altitude } }) {
    return this.properties.altitude - altitude;
  }

  _speedFrom(other) {
    if (this._delayFrom(other) == 0)
      throw "Teleportation is not yet a possibility";
    return this.distanceTo(other) / this._delayFrom(other);
  }

  _verticalSpeedFrom(other) {
    if (this._delayFrom(other) == 0)
      throw "Teleportation is not yet a possibility";

    return this._climbFrom(other) / this._delayFrom(other);
  }

  static from({ accuracy, altitude, speed, heading, ...others } = {}) {
    return arguments[0] instanceof this
      ? arguments[0]
      : super.from({ accuracy, altitude, speed, heading, ...others });
  }

  static fromGeolocationPosition({
    coords: {
      latitude,
      longitude,
      altitude,
      accuracy,
      altitudeAccuracy,
      heading,
      speed,
    },
    timestamp,
  }) {
    return new this([longitude, latitude, altitude], {
      accuracy,
      altitudeAccuracy,
      altitudeReference: "WGS84",
      speed,
      heading,
      timestamp,
    });
  }
}
