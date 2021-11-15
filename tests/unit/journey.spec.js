import { Journey } from "@/models/Journey";
import { Branch } from "@/models/Branch";
import { Model } from "@/models/Base";
import { Location } from "@/models/Location";

class Position {
  constructor(coordinates = [], properties = {}) {
    if (arguments[0] instanceof this.constructor) return arguments[0];

    Object.assign(this, { geometry: { coordinates }, properties });
  }

  toJSON() {
    return {
      ...this,
      type: this.constructor.name
    };
  }
  static from({ geometry: { coordinates } = {}, properties }) {
    if (arguments[0] instanceof this) return arguments[0];
    return new this(coordinates, properties);
  }
}

describe("journey", () => {
  let emptyJourney, fullJourney;
  beforeEach(() => {
    emptyJourney = new Journey();

    fullJourney = new Journey(
      {
        name: "test flight"
      },
      new Branch(
        Position,
        {},
        new Position([0, -1, 1], { timestamp: 4000 }),
        new Position([1, 1, 0], { timestamp: 6000 })
      ),
      new Branch(
        Position,
        {},
        new Position([-1, 0, 0], { timestamp: 1000 }),
        new Position([0, 1, 1], { timestamp: 2000 })
      )
    );
  });

  it("extends Model", () => {
    expect(Journey.prototype).toBeInstanceOf(Model);
  });

  it("is instantiated", () => {
    expect(emptyJourney).toHaveProperty("branches", []);
    expect(emptyJourney).toHaveProperty("properties", {});

    expect(fullJourney).toHaveProperty(
      "branches",
      expect.arrayContaining([expect.any(Branch), expect.any(Branch)])
    );
    expect(fullJourney).toHaveProperty("properties", { name: "test flight" });
  });

  it("property 'name' proxy 'properties.name'", () => {
    expect(fullJourney).toHaveProperty("name", fullJourney.properties.name);
    fullJourney.name = "new test flight";
    expect(fullJourney).toHaveProperty("name", "new test flight");
    expect(fullJourney).toHaveProperty("name", fullJourney.properties.name);
  });

  it("hold geom, bbox & length", () => {
    expect(fullJourney.geom).toMatchSnapshot();
    expect(fullJourney.bbox).toMatchSnapshot();
    expect(fullJourney.length).toMatchSnapshot();
  });

  it("should behave a bit like an array", () => {
    let branches;

    branches = jest.spyOn(fullJourney.branches, "forEach");
    fullJourney.forEach(x => x);
    expect(branches).toHaveBeenCalled();

    branches = jest.spyOn(fullJourney.branches, "map");
    fullJourney.map(x => x);
    expect(branches).toHaveBeenCalled();

    branches = jest.spyOn(fullJourney.branches, "filter");
    fullJourney.filter(() => true);
    expect(branches).toHaveBeenCalled();
  });

  it("should push, shift from last branch", () => {
    expect(fullJourney.last()).toBe(
      fullJourney.branches[fullJourney.branches.length - 1]
    );
    let lastbranch;

    lastbranch = jest.spyOn(fullJourney.last(), "push");
    fullJourney.push(new Location([1, 2, 3]));
    lastbranch = jest.spyOn(fullJourney.last(), "shift");
    fullJourney.shift();
    expect(lastbranch).toHaveBeenCalled();
  });

  it("addBranch push branch at the end of 'branches'", () => {
    emptyJourney.addBranch();
    emptyJourney.addBranch([{}, {}, {}], { name: "empty branch" });
    expect(emptyJourney).toHaveProperty(
      "branches",
      expect.arrayContaining([expect.any(Branch)])
    );
  });

  it("getBranch return a Branch object given an id or the object.", () => {
    let aBranch = fullJourney.branches[1];
    expect(fullJourney.getBranch(1)).toBe(aBranch);
    expect(fullJourney.getBranch(aBranch)).toBe(aBranch);
  });

  it("removeBranch remove branch by id or object", () => {
    let branch = fullJourney.last();
    fullJourney.removeBranch(branch);
    expect(fullJourney).toHaveProperty(
      "branches",
      expect.not.arrayContaining([branch])
    );
  });

  it("should remove a given branch", () => {
    expect(fullJourney.removeBranch(-1)).toBe(fullJourney);
    expect(fullJourney.branches).toHaveLength(1);
    expect(fullJourney).toHaveProperty(
      "branches",
      expect.arrayContaining([expect.any(Branch)])
    );
  });

  it("should export as JSON", () => {
    expect(fullJourney.toJSON()).toMatchSnapshot();
  });

  it("should export as GeoJSON", () => {
    expect(fullJourney.toGeoJSON()).toStrictEqual(
      fullJourney.toGeoJSON("FeatureCollection")
    );
    expect(fullJourney.toGeoJSON("FeatureCollection")).toMatchSnapshot();
    expect(fullJourney.toGeoJSON("LineString")).toStrictEqual(
      fullJourney.toGeoJSON("Feature")
    );
    expect(fullJourney.toGeoJSON("Feature")).toMatchSnapshot();
    // expect(fullJourney.toGeoJSON('MultiLineString', 'MultiPolygon')).toMatchSnapshot();
  });

  it("should import as JSON", () => {
    expect(Journey.from(fullJourney)).toBe(fullJourney);
    expect(
      Journey.from({ ...fullJourney.toJSON(), _id: 12 })
    ).toMatchSnapshot();
    // expect(Journey.from(fullJourney.toJSON())).toMatchObject(fullJourney);
  });
});
