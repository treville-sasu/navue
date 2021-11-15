import { Model } from "@/models/Base";
import { Branch } from "@/models/Branch";
import { Distance } from "@/models/Quantities";

import { multiLineString, featureCollection, round } from "@turf/helpers";
import bbox from "@turf/bbox";
import length from "@turf/length";

export { Branch };
// FIXME: create branche if none exists
export class Journey extends Model {
  constructor(properties = {}, ...branches) {
    super({ properties, branches });
  }

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
    return this.last().push(...positions);
  }

  shift() {
    return this.last().shift();
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

  addBranch(locations = [], properties) {
    this.branches.push(new Branch(undefined, properties, ...locations));
    return this;
  }

  getBranch(ref) {
    if (ref instanceof Branch) return ref;
    else if (Number.isInteger(ref)) return this.branches[ref];
    else return undefined;
  }

  removeBranch(ref) {
    let index = this.branches.indexOf(this.getBranch(ref));
    this.branches.splice(index, 1);
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
        case "LineString":
          return featureCollection(
            this.branches.flatMap(b => b.toGeoJSON("LineString"), {
              bbox: this.bbox
            })
          );
        case "MultiLineString":
          return featureCollection(
            this.branches.flatMap(
              b => b.toGeoJSON("MultiLineString").features,
              {
                bbox: this.bbox
              }
            )
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

  static from({ type, branches = [], properties, ...others }) {
    if (arguments[0] instanceof this) return arguments[0];
    else if (type === this.name) {
      let created = new this(properties);
      branches.forEach(({ features, properties }) => {
        created.addBranch(features, properties);
      });

      Object.assign(created, others); //allow for private props like _id, _rev....
      return created;
    } else throw `Invalid data : 'type' should be '${this.name}' got '${type}'`;
  }
}
