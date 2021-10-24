import { Navigation } from "@/models/Navigation";
import { Waypoint } from "@/models/Waypoint";
import { Branch, Journey } from "@/models/Journey";

describe("navigation", () => {
  let emptynavigation, navigation;
  beforeEach(() => {
    emptynavigation = new Navigation({
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

    expect(emptynavigation).toHaveProperty(
      "properties.name",
      "test navigation"
    );
    expect(emptynavigation).toHaveProperty("properties.notes", "model");
    expect(emptynavigation).toHaveProperty("properties.assets", { a: 1 });
    expect(emptynavigation).not.toHaveProperty("properties.manufacturer");

    expect(navigation).toHaveProperty(
      "branches",
      expect.arrayContaining([expect.any(Branch), expect.any(Branch)])
    );
  });

  it.todo("test for call to super, in constructor");
  it.todo("waypoints");
  it("hold a list of POI", () => {
    expect(navigation.poi).toMatchSnapshot();
  });

  it("add a new branch", () => {
    expect(emptynavigation.addBranch()).toBe(emptynavigation);
    expect(emptynavigation.branches).toHaveLength(1);
    expect(emptynavigation).toHaveProperty(
      "branches",
      expect.arrayContaining([expect.any(Branch)])
    );
  });

  // it.todo("clearRoute");
  it.todo("addWaypoint");
  it.todo("removeWaypoint");
  it.todo("getNextWaypoint");

  it("export toGeoJSON as Great Circle", () => {
    expect(navigation.toGeoJSON("MultiLineString")).toStrictEqual(
      navigation.toGeoJSON("Feature")
    );
    expect(navigation.toGeoJSON("MultiLineString")).toMatchSnapshot();
  });

  it.todo("test for call to super, in toGeoJSON");
  it.todo("import from toGeoJSON");
});
