import { Navigation } from "@/models/Navigation.js";
import { Waypoint } from "@/models/Waypoint.js";
import { Model, Store } from "../../src/models/Base";

describe("navigation", () => {
  it("extends Model", () => {
    expect(Navigation.prototype).toBeInstanceOf(Model);
  });
  it("create with defaults", () => {
    const nav = new Navigation();
    expect(nav).toHaveProperty("name", undefined);
    expect(nav).toHaveProperty("notes", undefined);
    expect(nav).toHaveProperty("routes", expect.any(Store));
  });

  it("create with properties & routes", () => {
    const nav = new Navigation(
      {
        name: "test Nav",
        notes: "some text"
      },
      new Store(
        {},
        new Waypoint(0, 0, 0, { name: "A" }),
        new Waypoint(1, 1, 1, { name: "B" })
      )
    );
    expect(nav).toHaveProperty("name", "test Nav");
    expect(nav).toHaveProperty("notes", "some text");
    expect(nav).toHaveProperty(
      "routes",
      new Store(
        {},
        new Store(
          {},
          new Waypoint(0, 0, 0, { name: "A" }),
          new Waypoint(1, 1, 1, { name: "B" })
        )
      )
    );
  });

  it("create a Navigation from literal", () => {
    expect(() => Navigation.from({})).toThrow(
      "Invalid data : 'type' should be 'Navigation' got 'undefined'"
    );
    let navigationLiteral = {
      type: "Navigation",
      name: "navigation name",
      routes: {
        type: "Store",
        items: [
          {
            type: "Store",
            items: [
              {
                type: "Waypoint",
                name: "A",
                latitude: 0,
                longitude: 0
              },
              {
                type: "Waypoint",
                name: "B",
                latitude: 1,
                longitude: 1
              }
            ]
          },
          {
            type: "Store",
            items: [
              {
                type: "Waypoint",
                name: "C",
                latitude: 2,
                longitude: 2
              },
              {
                type: "Waypoint",
                name: "D",
                latitude: 3,
                longitude: 3
              }
            ]
          }
        ]
      }
    };

    expect(Navigation.from(navigationLiteral)).toStrictEqual(
      new Navigation(
        {
          name: "navigation name"
        },
        new Store(
          {},
          new Waypoint(0, 0, undefined, { name: "A" }),
          new Waypoint(1, 1, undefined, { name: "B" })
        ),
        new Store(
          {},
          new Waypoint(2, 2, undefined, { name: "C" }),
          new Waypoint(3, 3, undefined, { name: "D" })
        )
      )
    );
  });

  it("add a new route", () => {
    const nav = new Navigation();
    expect(nav.addRoute()).toBeInstanceOf(Store);
    expect(nav.routes).toHaveLength(1);
    expect(nav.routes).toStrictEqual(new Store({}, new Store()));
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
    expect(
      new Navigation(
        {},
        new Store({}, new Waypoint(-1, 0), new Waypoint(0, 1)),
        new Store({}, new Waypoint(0, -1), new Waypoint(1, 1))
      ).toBounds()
    ).toStrictEqual([
      [-1, -1],
      [1, 1]
    ]);
  });
});
