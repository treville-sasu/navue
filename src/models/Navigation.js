import { Model, Collection } from "@/models/Base.js";
import { Waypoint } from "@/models/Waypoint.js";

export class Navigation extends Model {
  constructor({ name, notes, routes = [] } = {}) {
    routes = RouteCollection.from(routes);
    super({ name, notes, routes });
    this.type = "navigation";
  }

  addRoute(...args) {
    return this.routes.append(...args);
  }

  removeRoute(rte) {
    return rte instanceof Collection
      ? this.routes.remove(rte)
      : this.routes.splice(rte, 0);
  }

  addWaypoint({ insertBefore, ...wp } = {}, route = this.routes.last()) {
    return insertBefore ? route.insert(wp, insertBefore) : route.append(wp);
  }

  removeWaypoint(wp, route = this.routes.last()) {
    return wp instanceof Waypoint ? route.remove(wp) : route.splice(wp, 1);
  }

  getNextWaypoint(wp) {
    const wpId = this.routes.flat().indexOf(wp);
    return this.routes.flat()[wpId + 1];
  }
}

export class RouteCollection extends Collection {
  create(...args) {
    return Route.from(...args);
  }

  static from(collection) {
    const routeCollection = new RouteCollection();
    for (const route of collection) {
      if (Array.isArray(route)) routeCollection.append(route);
    }
    return routeCollection;
  }
}
export class Route extends Collection {
  create(...args) {
    return new Waypoint(...args);
  }

  static from(collection) {
    const route = new Route();
    if (Array.isArray(collection))
      for (const waypoint of collection) {
        route.append(waypoint);
      }
    return route;
  }
}
