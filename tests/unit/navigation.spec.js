import { RouteCollection, Route, Navigation } from "@/models/Navigation.js";
import { Waypoint } from "@/models/Waypoint.js";
import { Model, Collection } from "../../src/models/Base";

describe("routeCollection", () => {
  it("extends Collection", () => {
    expect(RouteCollection.prototype).toBeInstanceOf(Collection);
  });
  it("create RouteCollection with values", () => {
    // expect(new RouteCollection(1, 2)).toEqual([1, 2]);
    expect(new RouteCollection(1, 2)).toStrictEqual(
      expect.arrayContaining([1, 2])
    );
  });
  it("create a Route from, RouteCollection", () => {
    expect(new RouteCollection().create()).toBeInstanceOf(Route);
  });
});
describe("route", () => {
  it("extends Collection", () => {
    expect(Route.prototype).toBeInstanceOf(Collection);
  });
  it("create Route with values", () => {
    expect(new Route(1, 2)).toStrictEqual(expect.arrayContaining([1, 2]));
  });
  it("create a Waypoint from, Route", () => {
    expect(new Route().create()).toBeInstanceOf(Waypoint);
  });
});

describe("navigation", () => {
  it("extends Model", () => {
    expect(Navigation.prototype).toBeInstanceOf(Model);
  });
  it("create with defaults", () => {
    const nav = new Navigation();
    expect(nav).toHaveProperty("name", undefined);
    expect(nav).toHaveProperty("notes", undefined);
    expect(nav).toHaveProperty("routes", expect.any(RouteCollection));
  });

  it("create with properties & rejects unvalid property", () => {
    const nav = new Navigation({
      name: "test Nav",
      surname: "kiki",
      notes: "some text",
      routes: [
        [
          { name: "A", latitude: 0, longitude: 0 },
          { name: "B", latitude: 0, longitude: 1 }
        ],
        "some text at the wrong place"
      ]
    });
    expect(nav).toHaveProperty("name", "test Nav");
    expect(nav).toHaveProperty("notes", "some text");
    expect(nav).not.toHaveProperty("surname");
    expect(nav).toHaveProperty(
      "routes",
      new RouteCollection(
        new Route(
          new Waypoint({ name: "A", latitude: 0, longitude: 0 }),
          new Waypoint({ name: "B", latitude: 0, longitude: 1 })
        )
      )
      // new RouteCollection(new Route("someObject"))
      // expect.arrayContaining(new Route("someObject"))
    );
  });

  it("add a new route", () => {
    const nav = new Navigation();
    expect(nav.addRoute()).toBeInstanceOf(Route);
    expect(nav.routes).toHaveLength(1);
    expect(nav.routes).toEqual(new RouteCollection(new Route()));
  });

  it("remove a given route", () => {
    const navigation = new Navigation();
    const route = navigation.addRoute();
    navigation.removeRoute(route);
    expect(navigation.routes).toHaveLength(0);
  });
});
