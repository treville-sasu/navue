import { Model, Store } from "@/models/Base.js";
import { Waypoint } from "@/models/Waypoint.js";

export class Navigation extends Model {
  constructor({ name, notes } = {}, ...routes) {
    routes = new Store({}, ...routes).keep(r => {
      return r.keep(w => (w instanceof Waypoint ? w : undefined));
    });

    super({ name, notes, routes });
  }

  addRoute(...args) {
    this.routes.add(new Store({}, ...args));
    return this.routes.last;
  }

  removeRoute(route) {
    return this.routes.remove(route);
  }

  clearRoute(route) {
    route = this.getRoute(route);
    if (route && route.length == 0) {
      this.removeRoute(route);
      return true;
    }
  }

  addWaypoint({ insertBefore, ...wp } = {}, route) {
    route = this.getRoute(route);
    return route.add(Waypoint.from({ ...wp, type: "Waypoint" }), insertBefore);
  }

  removeWaypoint(wp, route) {
    route = this.getRoute(route);
    return Number.isInteger(wp)
      ? route.remove(undefined, wp)
      : route.remove(wp);
  }

  getNextWaypoint(wp) {
    const id = this.waypoints.indexOf(wp);
    return this.waypoints[id + 1];
  }

  getRoute(objindex) {
    if (objindex instanceof Store) return objindex;
    else if (isFinite(objindex)) return this.routes.items[objindex];
    else return this.last;
  }

  getRouteId(objindex) {
    if (objindex instanceof Store) return this.routes.indexOf(objindex);
    else if (Number.isInteger(objindex)) return objindex;
    else return this.routes.length - 1;
  }
  // TODO write specs
  get waypoints() {
    return this.routes.items.map(r => r.items).flat();
  }

  // toGeoJSON() {}
  toBounds() {
    return this.waypoints.reduce((minmax, wp, index) => {
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

  static from({ type, routes, _id, _rev, ...properties } = {}) {
    if (arguments[0] instanceof this) return arguments[0];
    else if (type != this.name)
      throw `Invalid data : 'type' should be '${this.name}' got '${type}'`;
    else {
      if (routes) routes = Store.from(routes, Store, Waypoint);

      let imported = new this(properties, ...routes);
      if (_id && _rev) Object.assign(imported, { _id, _rev });
      return imported;
    }
  }
}
