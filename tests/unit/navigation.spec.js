import { Navigation } from "@/models/Navigation";
import { Waypoint } from "@/models/Waypoint";
import { Branch, Journey } from "@/models/Journey";

describe("navigation", () => {
  let empty, navigation;
  beforeEach(() => {
    empty = new Navigation({
      name: "test navigation",
      notes: "model",
      manufacturer: "not allowed",
      assets: { a: 1 }
    });

    navigation = new Navigation(
      {
        name: "test navigation"
      },
      new Branch(
        Waypoint,
        {},
        new Waypoint([0, 0, 10], { name: "A" }),
        new Waypoint([1, 1, 20], { name: "Babababa" }),
        new Waypoint([1, 2, 20], { name: "LFBA" })
      ),
      new Branch(
        Waypoint,
        {},
        new Waypoint([2, 2, 20], { name: "C" }),
        new Waypoint([3, 3, 10], { name: "Dadadadada" }),
        new Waypoint([3, 4, 10], { name: "LFDE" })
      )
    );
  });

  it("extends Model", () => {
    expect(Navigation.prototype).toBeInstanceOf(Journey);
  });

  it("is instantiated", () => {
    expect(new Navigation()).toHaveProperty("properties.name", undefined);
    expect(new Navigation()).toHaveProperty("properties.notes", undefined);
    expect(new Navigation()).toHaveProperty(
      "properties.assets",
      expect.any(Object)
    );

    expect(new Navigation()).toHaveProperty("branches", expect.any(Array));

    expect(empty).toHaveProperty("properties.name", "test navigation");
    expect(empty).toHaveProperty("properties.notes", "model");
    expect(empty).toHaveProperty("properties.assets", { a: 1 });
    expect(empty).not.toHaveProperty("properties.manufacturer");

    expect(navigation).toHaveProperty(
      "branches",
      expect.arrayContaining([expect.any(Branch), expect.any(Branch)])
    );
  });

  it.todo("test for call to super, in constructor");

  it("hold a list of POI", () => {
    expect(navigation.poi).toMatchSnapshot();
  });

  it("add a new branch", () => {
    expect(empty.addBranch()).toBe(empty);
    expect(empty.branches).toHaveLength(1);
    expect(empty).toHaveProperty(
      "branches",
      expect.arrayContaining([expect.any(Branch)])
    );
  });

  // it.todo("clearBranch");

  it("getWaypoint return waypoints at indexes", () => {
    expect(navigation.getWaypoint(1, 1)).toBe(
      navigation.branches[1].features[1]
    );
    expect(navigation.getWaypoint(6, 6)).toBeUndefined();
  });

  it("indexOf returns an array of indexes", () => {
    let w = navigation.getWaypoint(1, 1);
    expect(navigation.indexOf(w)).toEqual([1, 1]);
    expect(navigation.indexOf(new Waypoint([1, 1]))).toBeUndefined();
  });

  it("getNextWaypoint", () => {
    expect(navigation.getNextWaypoint(navigation.getWaypoint(1, 1))).toBe(
      navigation.branches[1].features[2]
    );
    expect(navigation.getNextWaypoint(navigation.getWaypoint(0, 2))).toBe(
      navigation.branches[1].features[0]
    );
    expect(
      navigation.getNextWaypoint(navigation.getWaypoint(2, 2))
    ).toBeUndefined();
  });

  // it.todo("addWaypoint");

  it("removeWaypoint", () => {
    expect(navigation.removeWaypoint(0, 0)).toBe(navigation.branches[0]);
    expect(navigation.removeWaypoint(0, 0)).toBe(navigation.branches[0]);
    expect(navigation.removeWaypoint(0, 0)).toBeUndefined();
    expect(navigation.removeWaypoint(0, 3)).toBe(navigation.branches[0]);

    expect(() => navigation.removeWaypoint(6, 3)).toThrowError(
      "'6' can't be coerced as a Branch"
    );
  });

  it("export toGeoJSON as Great Circle", () => {
    expect(navigation.toGeoJSON("MultiLineString")).toStrictEqual(
      navigation.toGeoJSON("Feature")
    );
    expect(navigation.toGeoJSON("MultiLineString")).toMatchSnapshot();
  });

  it.todo("test for call to super, in toGeoJSON");
  it.todo("import from toGeoJSON");
});
