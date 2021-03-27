import { RouteCollection, Route, Navigation } from "@/models/Navigation.js";
import { Waypoint } from "@/models/Waypoint.js";
import { Model, Collection } from "../../src/models/Base";

describe("navigation", () => {
  it("extends Model", () => {
    expect(Navigation.prototype).toBeInstanceOf(Model);
  });
  it("create with defaults", () => {
    const nav = new Navigation();
    expect(nav).toHaveProperty("name", undefined);
    expect(nav).toHaveProperty("notes", undefined);
    expect(nav).toHaveProperty("routes", expect.any(Array));
  });

  it("create with properties & rejects unvalid property", () => {
    const nav = new Navigation({
      name: "test Nav",
      notes: "some text",
      routes: [
        [
          { name: "A", latitude: 0, longitude: 0 },
          { name: "B", latitude: 0, longitude: 1 }
        ]
      ]
    });
    expect(nav).toHaveProperty("name", "test Nav");
    expect(nav).toHaveProperty("notes", "some text");
    expect(nav).not.toHaveProperty("surname");
    expect(nav).toHaveProperty(
      "routes",
      new Array(
        new Array(
          Waypoint.from({ name: "A", latitude: 0, longitude: 0 }),
          Waypoint.from({ name: "B", latitude: 0, longitude: 1 })
        )
      )
    );
  });

  it("rejects unvalid properties", () => {
    expect(() => {
      new Navigation({
        routes: ["not a route"]
      });
    }).toThrow("'not a route' cannot be coerced in a route");
    expect(
      new Navigation({
        surname: "kiki"
      })
    ).not.toHaveProperty("surname");
  });

  it("add a new route", () => {
    const nav = new Navigation();
    expect(nav.addRoute()).toBeInstanceOf(Array);
    expect(nav.routes).toHaveLength(1);
    expect(nav.routes).toStrictEqual(new Array(new Array()));
  });

  it("remove a given route", () => {
    const navigation = new Navigation();
    const route = navigation.addRoute();
    navigation.removeRoute(route);
    expect(navigation.routes).toHaveLength(0);
  });

  it.todo("clearRoute");
  it.todo("addWaypoint");
  it.todo("getNextWaypoint");
  it.todo("getRoute");
  it.todo("getRouteId");
  it.todo("toGeoJSON");

  it("calculate bounds of navigation", () => {
    const nav = new Navigation({
      routes: [
        [
          { name: "A", latitude: -1, longitude: 0 },
          { name: "B", latitude: 0, longitude: 1 }
        ],
        [
          { name: "C", latitude: 0, longitude: -1 },
          { name: "D", latitude: 1, longitude: 1 }
        ]
      ]
    });
    expect(nav.toBounds()).toEqual([
      [-1, -1],
      [1, 1]
    ]);
  });
});

// describe("routeCollection", () => {
//   it("extends Collection", () => {
//     expect(RouteCollection.prototype).toBeInstanceOf(Collection);
//   });
//   it("create RouteCollection with values", () => {
//     expect(new RouteCollection(1, 2)).toStrictEqual(
//       expect.arrayContaining([1, 2])
//     );
//   });
//   it("create a Route from a RouteCollection", () => {
//     expect(new RouteCollection().create()).toBeInstanceOf(Route);
//   });
//   it("create a RouteCollection from an iterable", () => {
//     const routeCollection = RouteCollection.from([
//       [1, 2],
//       [3, 4]
//     ]);
//     expect(routeCollection).toBeInstanceOf(RouteCollection);
//     expect(routeCollection).toHaveLength(2);
//     expect(routeCollection[0]).toBeInstanceOf(Route);
//     expect(routeCollection[0]).toHaveLength(2);
//     expect(routeCollection[1]).toBeInstanceOf(Route);
//     expect(routeCollection[1]).toHaveLength(2);
//   });
// });
// describe("route", () => {
//   it("extends Collection", () => {
//     expect(Route.prototype).toBeInstanceOf(Collection);
//   });
//   it("create Route with values", () => {
//     expect(new Route(1, 2)).toStrictEqual(expect.arrayContaining([1, 2]));
//   });
//   it("create a Waypoint from a Route", () => {
//     expect(new Route().create()).toBeInstanceOf(Waypoint);
//   });
//   it("create a Route from an iterable", () => {
//     const route = Route.from([{ longitude: 1 }, { latitude: 2 }]);
//     expect(route).toBeInstanceOf(Route);
//     expect(route).toHaveLength(2);
//     expect(route[0]).toBeInstanceOf(Waypoint);
//     expect(route[0]).toMatchObject({ longitude: 1 });
//     expect(route[1]).toBeInstanceOf(Waypoint);
//     expect(route[1]).toMatchObject({ latitude: 2 });
//   });
// });

// describe("navigation", () => {
//   it("extends Model", () => {
//     expect(Navigation.prototype).toBeInstanceOf(Model);
//   });
//   it("create with defaults", () => {
//     const nav = new Navigation();
//     expect(nav).toHaveProperty("name", undefined);
//     expect(nav).toHaveProperty("notes", undefined);
//     expect(nav).toHaveProperty("routes", expect.any(RouteCollection));
//   });

//   it("create with properties & rejects unvalid property", () => {
//     const nav = new Navigation({
//       name: "test Nav",
//       surname: "kiki",
//       notes: "some text",
//       routes: [
//         [
//           { name: "A", latitude: 0, longitude: 0 },
//           { name: "B", latitude: 0, longitude: 1 }
//         ],
//         "some text at the wrong place"
//       ]
//     });
//     expect(nav).toHaveProperty("name", "test Nav");
//     expect(nav).toHaveProperty("notes", "some text");
//     expect(nav).not.toHaveProperty("surname");
//     expect(nav).toHaveProperty(
//       "routes",
//       new RouteCollection(
//         new Route(
//           Waypoint.from({ name: "A", latitude: 0, longitude: 0 }),
//           Waypoint.from({ name: "B", latitude: 0, longitude: 1 })
//         )
//       )
//     );
//   });

//   it("add a new route", () => {
//     const nav = new Navigation();
//     expect(nav.addRoute()).toBeInstanceOf(Route);
//     expect(nav.routes).toHaveLength(1);
//     expect(nav.routes).toStrictEqual(new RouteCollection(new Route()));
//   });

//   it("remove a given route", () => {
//     const navigation = new Navigation();
//     const route = navigation.addRoute();
//     navigation.removeRoute(route);
//     expect(navigation.routes).toHaveLength(0);
//   });
// });
