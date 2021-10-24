import { Journey, Branch } from "@/models/Journey";
import { Waypoint } from "@/models/Waypoint";

import { segmentReduce } from "@turf/meta";
import greatCircle from "@turf/great-circle";
import distance from "@turf/distance";
import bearing from "@turf/bearing";
import { featureCollection, bearingToAzimuth, round } from "@turf/helpers";
import truncate from "@turf/truncate";

export class Navigation extends Journey {
  constructor({ name, notes, assets = {} } = {}, ...routes) {
    let branches = routes;
    super({ name, notes, assets }, ...branches);
  }

  get waypoints() {
    // needed for navigations summary, get nextWaypoint
    return this.routes.items.map(r => r.items).flat();
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
  // clearRoute(route) {
  //   route = this.getRoute(route);
  //   if (route && route.length == 0) {
  //     this.removeBranch(route);
  //     return true;
  //   }
  // }

  // Should be able to insert waypoint before/after another
  addWaypoint(wp, branchId, positionId) {
    this.branches[branchId].insert(Waypoint.from(wp), positionId + 1);
    // return
  }
  removeWaypoint(branchId, positionId) {
    let branch = this.branches[branchId];
    branch.remove(positionId);
    if (branch.features.length == 0) return this.removeBranch(branch);
  }

  //require indexOf(indexOf())
  getNextWaypoint(wp) {
    const id = this.waypoints.indexOf(wp);
    return this.waypoints[id + 1];
  }

  // getRoute(objindex) {
  // could be private
  //   if (objindex instanceof Store) return objindex;
  //   else if (isFinite(objindex)) return this.routes.items[objindex];
  //   else return this.last;
  // }

  toGeoJSON(type) {
    switch (type) {
      case "Feature":
      case "MultiLineString":
        return segmentReduce(
          super.toGeoJSON("MultiLineString"),
          (legs, { geometry: { coordinates } }, f, m, g, s) => {
            const [start, end] = coordinates;
            legs.features.push(
              truncate(
                greatCircle(start, end, {
                  npoints: 5,
                  properties: {
                    distance: round(distance(start, end)),
                    bearings: [
                      round(bearingToAzimuth(bearing(start, end))),
                      round(bearingToAzimuth(bearing(start, end, true)))
                    ],
                    insertAfter: [m, s] // branch and waypoint indexes
                  }
                })
              )
            );
            return legs;
          },
          featureCollection([])
        );
      // case "MultiPolygon":
      //   return featureCollection(
      //     this.branches.flatMap(b => b.toGeoJSON("MultiPolygon").features),
      //     { bbox: this.bbox }
      //   );
      default:
        return super.toGeoJSON(type);
    }
  }

  // static from({ type, routes, _id, _rev, ...properties } = {}) {
  //   if (arguments[0] instanceof this) return arguments[0];
  //   else if (type != this.name)
  //     throw `Invalid data : 'type' should be '${this.name}' got '${type}'`;
  //   else {
  //     if (routes) routes = Store.from(routes, Store, Waypoint);

  //     let imported = new this(properties, ...routes);
  //     if (_id && _rev) Object.assign(imported, { _id, _rev });
  //     return imported;
  //   }
  // }
}
