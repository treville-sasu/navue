import { Model } from "@/models/Base.js";
import { Location } from "@/models/Waypoint.js";

export class Flight extends Model {
  //TODO Constructor is not yet fully used & usable.
  constructor(
    { name, notes, checked = [], milestones = [] } = {},
    ...locations
  ) {
    if (locations.every(a => a instanceof Location)) locations = [locations];
    else if (
      locations.every(
        a => a instanceof Array && a.every(b => b instanceof Array)
      )
    )
      locations = locations.flat();

    super({ name, notes, locations, checked, milestones });
  }

  addLocation(location) {
    this.locations[this.locations.length - 1].push(Location.from(location));
    return this;
  }

  addTrace(...locations) {
    if (locations.every(a => a instanceof Array)) locations = locations.flat();
    this.locations[0].length == 0
      ? (this.locations[0] = locations)
      : this.locations.push(locations);
    return this;
  }

  get geom() {
    return this.locations.map(trace =>
      trace.map(({ latitude, longitude, altitude }) => [
        latitude,
        longitude,
        Number(altitude)
      ])
    );
  }

  // get duration() {
  //   return this.locations
  // }

  toGeoJSON(type = "Feature") {
    // eslint-disable-next-line no-unused-vars
    const { locations, ...properties } = this;
    switch (type) {
      case "Feature":
        return {
          type,
          properties: { ...properties },
          geometry: this.toGeoJSON("MultiLineString")
        };
      case "MultiLineString":
        return {
          type,
          coordinates: this.geom
        };
      case "MultiPoint":
        return {
          type,
          coordinates: this.geom.flat()
        };
      default:
        throw "not a valid GeoJSON object";
    }
  }

  toBounds() {
    return this.locations
      .flat()
      .reduce((bounds, { latitude, longitude }, index) => {
        if (index == 0)
          return [
            [latitude, longitude],
            [latitude, longitude]
          ];
        else
          return [
            [
              Math.min(latitude, bounds[0][0]),
              Math.min(longitude, bounds[0][1])
            ],
            [
              Math.max(latitude, bounds[1][0]),
              Math.max(longitude, bounds[1][1])
            ]
          ];
      }, undefined);
  }

  static from({ type, locations, _id, _rev, ...properties } = {}) {
    if (arguments[0] instanceof this) return arguments[0];
    else if (type != this.name)
      throw `Invalid data : 'type' should be '${this.name}' got '${type}'`;
    else {
      if (locations)
        locations = locations.map(t => t.map(l => Location.from(l)));

      let imported = new this(properties, ...locations);
      if (_id && _rev) Object.assign(imported, { _id, _rev });
      return imported;
    }
  }
}
