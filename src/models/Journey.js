import { Model } from "@/models/Base.js";
import { Distance } from "@/models/Quantities.js";

import {
  multiLineString,
  featureCollection,
  round,
  lineString
} from "@turf/helpers";
import bbox from "@turf/bbox";
import length from "@turf/length";
import buffer from "@turf/buffer";
import truncate from "@turf/truncate";

// FIXME: create branche if none exists
export class Journey extends Model {
  constructor(properties = {}, ...branches) {
    super({ properties, branches });
  }

  //TODO Specs getter/setter
  get name() {
    return this.properties.name;
  }

  set name(val) {
    return (this.properties.name = val);
  }

  last() {
    return this.branches[this.branches.length - 1];
  }

  push(...positions) {
    this.last().push(...positions);
    return this;
  }

  shift() {
    this.last().shift();
  }

  forEach(cb) {
    return this.branches.forEach(cb);
  }

  map(cb) {
    return this.branches.map(cb);
  }

  filter(cb) {
    return this.branches.filter(cb);
  }

  removeBranch(index) {
    // let index = this.branches.indexOf(branchId);
    this.branches.splice(index, 1).length;
    return this;
  }

  get geom() {
    return this.map(b => b.geom);
  }

  get bbox() {
    return bbox(multiLineString(this.geom));
  }

  get length() {
    return new Distance(
      round(length(multiLineString(this.geom), { units: "meters" }))
    );
  }

  //TODO Specs multi types
  toGeoJSON(...types) {
    if (types.length > 1) {
      return featureCollection(
        types.flatMap(type => {
          let feat = this.toGeoJSON(type);
          return feat.features ? feat.features : feat;
        })
      );
    } else
      switch (types[0]) {
        case "Feature":
        case "MultiLineString":
          return multiLineString(this.geom, this.properties, {
            bbox: this.bbox
          });
        case "MultiPolygon":
          return featureCollection(
            this.branches.flatMap(b => b.toGeoJSON("MultiPolygon").features),
            { bbox: this.bbox }
          );
        case "FeatureCollection":
        default:
          return featureCollection(
            this.branches.flatMap(
              b => b.toGeoJSON("FeatureCollection").features
            ),
            { bbox: this.bbox }
          );
      }
  }

  //TODO Spec _id, _rev
  static from({ type, branches = [], properties, _id, _rev }) {
    if (arguments[0] instanceof this) return arguments[0];
    else if (type === this.name) {
      let created = new this(properties);
      branches.forEach(({ features, properties }) =>
        created.addBranch(features, properties)
      );

      if (_id && _rev) Object.assign(created, { _id, _rev });
      return created;
    } else throw `Invalid data : 'type' should be '${this.name}' got '${type}'`;
  }
}

export class Branch extends Model {
  constructor(member, properties = {}, ...features) {
    super({ ...featureCollection(features), properties, member });
  }

  push(...positions) {
    this.features.push(
      ...positions.map(p => (this.member ? this.member.from(p) : p))
    );
    return this;
  }

  shift() {
    this.features.shift();
    return this;
  }

  insert(position, index) {
    this.features.splice(index, 0, position);
    return this;
  }

  remove(index) {
    this.features.splice(index, 1);
    return this;
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

  first() {
    return this.features[0];
  }

  last() {
    return this.features[this.features.length - 1];
  }

  pairs(cb) {
    let collection = [];
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
    return {
      ...this,
      // member: this.member.name,
      type: this.constructor.name
    };
  }

  toGeoJSON(type) {
    switch (type) {
      case "Feature":
      case "MultiLineString":
        return multiLineString(this.geom, this.properties, { bbox: this.bbox });
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
    // constructor || (constructor = member && member.match(/\w/) && eval(member));

    if (
      type === "FeatureCollection" &&
      features.every(({ geometry: { type } }) => type === "Point")
    )
      return new this(constructor, properties, ...features);
    else if (type === this.name)
      return new this(
        constructor,
        properties,
        ...features.map(i => {
          if (constructor && typeof constructor.from === "function")
            return constructor.from(i);
          // else if (constructor && (constructor.prototype.constructor === constructor))
          //   return new constructor(i);
          else return i;
        })
      );
    else throw `Invalid data : 'type' should be '${this.name}' got '${type}'`;
  }
}

// if (typeof classes === "undefined") var classes = {};
// classes["Branch"] = Branch;
