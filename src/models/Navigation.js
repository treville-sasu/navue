import { Journey, Branch } from "@/models/Journey";
import { Waypoint } from "@/models/Waypoint";

import { featureCollection } from "@turf/helpers";

export class Navigation extends Journey {
  constructor({ name, notes, assets = {} } = {}, ...routes) {
    let branches = routes;
    super({ name, notes, assets }, ...branches);
  }

  get poi() {
    return this.branches.flatMap(b =>
      b
        .map(p => p.properties.name)
        .filter(n => /^[A-Z]{4}$/.test(n))
        .flat()
    );
  }

  addBranch(waypoints = [], properties) {
    this.branches.push(new Branch(Waypoint, properties, ...waypoints));
    return this;
  }
  // needed after waypoint removal
  // clearBranch(route) {
  //   route = this.getRoute(route);
  //   if (route && route.length == 0) {
  //     this.removeBranch(route);
  //     return true;
  //   }
  // }

  getWaypoint(i, j) {
    return this.branches[i] && this.branches[i].features[j];
    // return this.branches[i]?.features[j];
  }

  indexOf(wp) {
    let j;
    let i = this.branches.findIndex(b => {
      return (j = b.features.indexOf(wp)) >= 0;
    });
    return i == -1 || j == -1 ? undefined : [i, j];
  }

  //not used yet
  // addWaypoint(wp, i, j) {
  //   return this.branches[i].insert(Waypoint.from(wp), j);
  // }

  removeWaypoint(i, j) {
    let branch = this.getBranch(i);
    if (!branch) throw `'${i}' can't be coerced as a Branch`;

    if (branch.remove(j)) return branch;
    else {
      this.removeBranch(branch);
      return undefined;
    }
    // return branch.remove(j) > 0 ? branch : this.removeBranch(branch);
  }

  getNextWaypoint(wp) {
    const ij = this.indexOf(wp);
    return ij
      ? this.getWaypoint(ij[0], ij[1] + 1) || this.getWaypoint(ij[0] + 1, 0)
      : undefined;
  }

  toGeoJSON(type) {
    switch (type) {
      case "Feature":
      case "MultiLineString":
        return featureCollection(
          this.branches.flatMap(b => b.toGeoJSON("MultiLineString").features),
          { bbox: this.bbox }
        );
      case "Geodesics":
        return featureCollection(
          this.branches.flatMap(b => b.toGeoJSON("Geodesics").features),
          { bbox: this.bbox }
        );
      default:
        return super.toGeoJSON(type);
    }
  }
}
