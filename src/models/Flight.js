import { Journey } from "@/models/Journey";
import { Location } from "@/models/Location";
import { Branch } from "./Journey";

export class Flight extends Journey {
  constructor(
    { name, notes, checked = [], milestones = [] } = {},
    ...locations
  ) {
    // let branches;
    // if (locations.every(a => a instanceof Location))
    //   branches = [new Branch(Location, {}, ...locations)];
    // else if (
    //   locations.every(
    //     a => a instanceof Array && a.every(b => b instanceof Branch)
    //   )
    // )
    //   branches = locations.flat();
    let branches = locations;
    super({ name, notes, checked, milestones }, ...branches);
  }

  addBranch(locations, properties) {
    this.branches.push(new Branch(Location, properties, ...locations));
    return this;
  }

  get duration() {
    return (
      this.branches.reduce((total, b) => {
        return (total +=
          b.last().properties.timestamp - b.first().properties.timestamp);
      }, 0) / 1000
    );
  }

  // static from({ type, locations, features, ...properties } = {}) {
  //   if (arguments[0] instanceof this) return arguments[0];

  //   switch (type) {
  //     case this.name:
  //       if (locations)
  //         locations = locations.map(t => t.map(l => Location.from(l)));

  //       break;
  //     case "FeatureCollection":
  //       locations = [features.map(l => Location.from(l))];
  //       // properties = { ...properties };
  //       break;

  //     default:
  //       throw `Invalid data : 'type' should be 'FeatureCollection' or '${this.name}' got '${type}'`;
  //   }

  //   return new this(properties, ...locations);
  // }
}
