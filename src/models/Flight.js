import { Model, Store } from "@/models/Base.js";
import { Location } from "@/models/Waypoint.js";

export class Flight extends Model {
  constructor(
    { name, notes, checked = [], markedTimes = [] } = {},
    ...locations
  ) {
    locations = new Store({}, ...locations);

    super({ name, notes, locations, checked, markedTimes });
  }

  addLocation(location) {
    delete location._id;
    delete location._rev;
    this.locations.add(Location.from(location));
    return this;
  }
  // toGeoJSON() {}
  toBounds() {
    return this.locations.reduce((minmax, wp, index) => {
      if (index == 0)
        return [
          [wp.latitude, wp.longitude],
          [wp.latitude, wp.longitude]
        ];
      else
        return [
          [
            Math.min(wp.latitude, minmax[0][0]),
            Math.min(wp.longitude, minmax[0][1])
          ],
          [
            Math.max(wp.latitude, minmax[1][0]),
            Math.max(wp.longitude, minmax[1][1])
          ]
        ];
    }, undefined);
  }

  static from({ type, locations, _id, _rev, ...properties } = {}) {
    if (arguments[0] instanceof this) return arguments[0];
    else if (type != this.name)
      throw `Invalid data : 'type' should be '${this.name}' got '${type}'`;
    else {
      if (locations) locations = Store.from(locations, Location);

      let imported = new this(properties, ...locations);
      if (_id && _rev) Object.assign(imported, { _id, _rev });
      return imported;
    }
  }
}
