import { Model } from "@/models/Base.js";

import { lineString, featureCollection, round } from "@turf/helpers";
import greatCircle from "@turf/great-circle";
import distance from "@turf/distance";
import bearing from "@turf/bearing";
import midpoint from "@turf/midpoint";

import bbox from "@turf/bbox";
import length from "@turf/length";

export class Branch extends Model {
  constructor(member, properties = {}, ...features) {
    if (member)
      features.forEach((f, i, arr) => {
        arr[i] = member.from(f);
      });
    super({ ...featureCollection(features), properties, member });
  }

  [Symbol.iterator]() {
    return this.features[Symbol.iterator]();
  }

  first() {
    return this.features[0];
  }

  last() {
    return this.features[this.features.length - 1];
  }

  push(...positions) {
    return this.features.push(
      ...positions.map((p) => (this.member ? this.member.from(p) : p))
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
    return this.geom.length > 2 ? bbox(lineString(this.geom)) : undefined;
  }

  get length() {
    return round(length(lineString(this.geom)));
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
      case "MultiLineString":
        return featureCollection(
          this.pairs((start, end, id) =>
            lineString([start.geometry.coordinates, end.geometry.coordinates], {
              distance: distance(
                start.geometry.coordinates,
                end.geometry.coordinates,
                { units: "meters" }
              ),
              bearing: bearing(
                start.geometry.coordinates,
                end.geometry.coordinates
              ),
              id,
            })
          ),
          { bbox: this.bbox }
        );
      case "Geodesics":
        return featureCollection(
          this.pairs((start, end, id) =>
            greatCircle(start.geometry.coordinates, end.geometry.coordinates, {
              npoints: 10,
              properties: {
                distance: distance(
                  start.geometry.coordinates,
                  end.geometry.coordinates,
                  { units: "meters" }
                ),
                bearing: bearing(
                  start.geometry.coordinates,
                  end.geometry.coordinates
                ),
                id,
              },
            })
          ),
          { bbox: this.bbox }
        );
      case "Midpoints":
        return featureCollection(
          this.pairs((start, end) =>
            midpoint(start.geometry.coordinates, end.geometry.coordinates)
          ),
          { bbox: this.bbox }
        );
      case "FeatureCollection":
        return {
          ...featureCollection(this.features, {
            bbox: this.bbox,
          }),
          properties: this.properties,
        };
      default:
        return featureCollection([
          ...this.toGeoJSON("FeatureCollection").features,
          ...this.toGeoJSON("Geodesics").features,
        ]);
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
