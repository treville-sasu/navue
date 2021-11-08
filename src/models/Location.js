import { Waypoint } from "@/models/Waypoint.js";
import { Altitude, Distance, Speed, Azimuth } from "@/models/Quantities.js";

import bbox from "@turf/bbox";
import buffer from "@turf/buffer";

export class Location extends Waypoint {
  get bbox() {
    return bbox(
      buffer(this.toGeoJSON(), Number(this.properties.accuracy), {
        units: "meters"
      })
    );
  }

  bounds(radius) {
    return bbox(
      buffer(this.toGeoJSON(), radius, {
        units: "meters"
      })
    );
  }

  legFrom(other) {
    return {
      distance: other.distanceTo(this),
      heading: other.bearingTo(this),
      speed: this._speedFrom(other),
      verticalSpeed: this._verticalSpeedFrom(other)
    };
  }

  willBeIn(delay) {
    if (this.properties.speed && this.properties.heading)
      return this.destinationPoint(
        this.properties.speed * delay,
        this.properties.heading
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
    return new Speed(this.distanceTo(other) / this._delayFrom(other));
  }

  _verticalSpeedFrom(other) {
    if (this._delayFrom(other) == 0)
      throw "Teleportation is not yet a possibility";

    return new Speed(this._climbFrom(other) / this._delayFrom(other));
  }

  static from({ accuracy, altitude, speed, heading, ...others } = {}) {
    if (arguments[0] instanceof this) return arguments[0];
    if (accuracy) accuracy = Distance.from(accuracy);
    if (altitude) altitude = Altitude.from(altitude);
    if (speed) speed = Speed.from(speed);
    if (heading) heading = Azimuth.from(heading);
    return super.from({ accuracy, altitude, speed, heading, ...others });
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

    if (accuracy) accuracy = new Distance(accuracy, "m");
    if (speed) speed = new Speed(speed, "m/s");
    if (heading) heading = new Azimuth(heading, "°");

    return new this([longitude, latitude, altitude], {
      accuracy,
      altitude,
      speed,
      heading,
      timestamp
    });
  }
}
