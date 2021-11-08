import { Model } from "@/models/Base.js";
import { Distance } from "@/models/Quantities.js";

import { lineString, featureCollection, round } from "@turf/helpers";
import bbox from "@turf/bbox";
import length from "@turf/length";
import buffer from "@turf/buffer";
import truncate from "@turf/truncate";

export class Branch extends Model {
  constructor(member, properties = {}, ...features) {
    if (member)
      features.forEach((f, i, arr) => {
        arr[i] = member.from(f);
      });
    super({ ...featureCollection(features), properties, member });
  }

  first() {
    return this.features[0];
  }

  last() {
    return this.features[this.features.length - 1];
  }

  push(...positions) {
    return this.features.push(
      ...positions.map(p => (this.member ? this.member.from(p) : p))
    );
  }

  shift() {
    return this.features.shift();
  }

  insert(position, index) {
    const pos = isNaN(index) ? this.features.length : index;
    this.features.splice(pos, 0, position);
    return position;
  }

  remove(index) {
    this.features.splice(index, 1);
    return this.features.length;
  }

  forEach(cb) {
    return this.features.forEach(cb);
  }

  map(cb) {
    return this.features.map(cb);
  }

  filter(cb) {
    return this.features.filter(cb);
  }

  pairs(cb) {
    let collection = [];
    if (this.features.length)
      this.features.reduce((previous, current, i, a) => {
        if (previous) collection.push(cb.call(this, previous, current, i, a));
        return current;
      });
    return collection;
  }

  get geom() {
    return this.map(({ geometry: { coordinates } }) => coordinates);
  }

  get bbox() {
    return bbox(lineString(this.geom));
  }

  get length() {
    return new Distance(
      round(length(lineString(this.geom), { units: "meters" }))
    );
  }

  toJSON() {
    // eslint-disable-next-line no-unused-vars
    let { member, ...json } = super.toJSON();
    return json;
  }

  toGeoJSON(type) {
    switch (type) {
      case "Feature":
      case "LineString":
        return lineString(this.geom, this.properties, { bbox: this.bbox });
      case "MultiPolygon":
        return featureCollection(
          this.pairs((start, end) => {
            return truncate(
              buffer(
                // TODO : Should we create midpoints and average the properties ? let's see in real life
                lineString(
                  [start.geometry.coordinates, end.geometry.coordinates],
                  start.properties
                ),
                Number(start.properties.accuracy) || 15,
                {
                  units: "meters",
                  steps: 1
                }
              ),
              { mutate: true }
            );
          }),
          { bbox: this.bbox }
        );
      case "FeatureCollection":
      default:
        return {
          ...featureCollection(this.features, {
            bbox: this.bbox
          }),
          properties: this.properties
        };
    }
  }

  static from({ type, features = [], properties }, constructor) {
    if (arguments[0] instanceof this) return arguments[0];

    if (type === this.name || type === "FeatureCollection")
      return new this(constructor, properties, ...features);
    else
      throw `Invalid data : 'type' should be '${this.name}' or 'FeatureCollection' got '${type}'`;
  }
}
