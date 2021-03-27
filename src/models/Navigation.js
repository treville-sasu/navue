import { Model } from "@/models/Base.js";
import { Waypoint } from "@/models/Waypoint.js";

export class Navigation extends Model {
  constructor({ name, notes, routes = [] } = {}) {
    routes.forEach((rte, i) => {
      if (rte instanceof Array)
        rte.forEach((wp, j) => {
          routes[i][j] = Waypoint.from(wp);
        });
      else throw `'${rte}' cannot be coerced in a route`;
    });
    super({ name, notes, routes });
    this.type = "navigation";
  }

  addRoute(...args) {
    this.routes.push(args);
    return this.routes[this.routes.length - 1];
  }

  removeRoute(route) {
    return this.routes.splice(this.getRouteId(route), 1);
  }

  clearRoute(route) {
    route = this.getRoute(route);
    if (route.length == 0) {
      this.removeRoute(route);
      return true;
    }
  }

  addWaypoint({ insertBefore, ...wp } = {}, route) {
    route = this.getRoute(route);
    wp = Waypoint.from(wp);
    return insertBefore ? route.splice(insertBefore, 0, wp) : route.push(wp);
  }

  removeWaypoint(wp, route) {
    route = this.getRoute(route);
    return wp instanceof Waypoint
      ? route.splice(route.indexOf(wp), 1)
      : route.splice(wp, 1);
  }

  getNextWaypoint(wp) {
    const id = this.routes.flat().indexOf(wp);
    return this.routes.flat()[id + 1];
  }

  getRoute(objindex) {
    if (objindex instanceof Array) return objindex;
    else if (isFinite(objindex)) return this.routes[objindex];
    else return this.routes[this.routes.length - 1];
  }

  getRouteId(objindex) {
    if (objindex instanceof Array) return this.routes.indexOf(objindex);
    else if (isFinite(objindex)) return objindex;
    else return this.routes.length - 1;
  }

  // toGeoJSON() {}
  toBounds() {
    return this.routes.flat().reduce((minmax, wp, index) => {
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

  static from(object) {
    if (object.type == "navigation") {
      let imported = new this(object);
      if (object._id) imported._id = object._id;
      if (object._rev) imported._rev = object._rev;
      return imported;
    } else
      throw `Invalid data : 'type' should be 'navigation' got '${object.type}'`;
  }
}
