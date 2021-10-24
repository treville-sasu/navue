import { Branch, Journey } from "@/models/Journey";
import { Model } from "@/models/Base";
import { Location } from "@/models/Location";

describe("branch", () => {
  let empty, numbered, branch;
  beforeEach(() => {
    empty = new Branch();
    numbered = new Branch(Number, { a: 1 }, 1, 2);

    class Position {
      constructor(args) {
        Object.assign(this, args);
      }
      static from(args) {
        return new this(args);
      }
    }

    branch = new Branch(
      Position,
      { a: 1 },
      {
        geometry: {
          coordinates: [0, 0, 1],
          type: "Point"
        },
        properties: {
          altitude: 1
        },
        type: "Feature"
      },
      {
        geometry: {
          coordinates: [1, 1, 0],
          type: "Point"
        },
        properties: {
          altitude: 0
        },
        type: "Feature"
      },
      {
        geometry: {
          coordinates: [-1, -1, 2],
          type: "Point"
        },
        properties: {
          altitude: 0
        },
        type: "Feature"
      }
    );
  });

  it("extends Model", () => {
    expect(Branch.prototype).toBeInstanceOf(Model);
  });

  // it.skip("is registerd globaly", () => {
  //   expect(classes["Branch"]).toBe(Branch);
  // });

  it("is instantiated", () => {
    expect(empty).toHaveProperty("features", []);
    expect(empty).toHaveProperty("member", undefined);
    expect(empty).toHaveProperty("properties", {});

    expect(numbered).toHaveProperty("member", Number);
    expect(numbered).toHaveProperty("features", [1, 2]);
    expect(numbered).toHaveProperty("properties", { a: 1 });
  });

  it("hold, geom, bbox & length", () => {
    expect(branch.geom).toMatchSnapshot();
    expect(branch.bbox).toMatchSnapshot();
    expect(branch.length).toMatchSnapshot();
  });

  it("should behave a bit like an array", () => {
    let features;
    // FIXME: member.from should be replaced by new Member()
    features = jest.spyOn(empty.features, "push");
    empty.push(1, 2);
    expect(features).toHaveBeenCalled();

    features = jest.spyOn(branch.features, "push");
    branch.push(1, 2);
    expect(features).toHaveBeenCalled();
    features = jest.spyOn(branch.features, "shift");
    branch.shift(1, 2);
    expect(features).toHaveBeenCalled();

    features = jest.spyOn(branch.features, "forEach");
    branch.forEach(x => x);
    expect(features).toHaveBeenCalled();

    features = jest.spyOn(branch.features, "map");
    branch.map(x => x);
    expect(features).toHaveBeenCalled();

    features = jest.spyOn(branch.features, "filter");
    branch.filter(() => true);
    expect(features).toHaveBeenCalled();
  });

  it.todo("insert new position at given index");
  it.todo("remove position at given index");

  it("should return first & last feature", () => {
    expect(branch.first()).toBe(branch.features[0]);
    expect(branch.last()).toBe(branch.features[branch.features.length - 1]);
  });

  it("should iterate over pairs", () => {
    expect(branch.pairs((p, c, i) => i)).toEqual([1, 2]);
  });

  it("should export as GeoJSON", () => {
    expect(branch.toGeoJSON()).toStrictEqual(
      branch.toGeoJSON("FeatureCollection")
    );
    expect(branch.toGeoJSON("FeatureCollection")).toMatchSnapshot();

    expect(branch.toGeoJSON("MultiLineString")).toStrictEqual(
      branch.toGeoJSON("Feature")
    );
    expect(branch.toGeoJSON("Feature")).toMatchSnapshot();

    expect(branch.toGeoJSON("MultiPolygon")).toMatchSnapshot();
  });

  it("should export as JSON", () => {
    expect(numbered.toJSON()).toMatchSnapshot();
    expect(branch.toJSON()).toMatchSnapshot();
  });
  it("should import as JSON", () => {
    expect(Branch.from(empty)).toBe(empty);

    expect(Branch.from(branch.toJSON(), branch.member)).toMatchObject(branch);
    expect(Branch.from(numbered.toJSON(), Number)).toMatchObject(numbered);

    // eslint-disable-next-line no-unused-vars
    let { member, ...almost } = branch;
    expect(Branch.from(branch.toGeoJSON())).toMatchObject(almost);
    expect(Branch.from(branch.toJSON())).toMatchObject(almost);
  });
});
describe("journey", () => {
  let emptyJourney, fullJourney;
  beforeEach(() => {
    emptyJourney = new Journey();

    fullJourney = new Journey(
      {
        name: "test flight"
      },
      new Branch(
        Location,
        {},
        new Location([0, -1, 1], { timestamp: 4000 }),
        new Location([1, 1, 0], { timestamp: 6000 })
      ),
      new Branch(
        Location,
        {},
        new Location([-1, 0, 0], { timestamp: 1000 }),
        new Location([0, 1, 1], { timestamp: 2000 })
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

  it("should remove a given branch", () => {
    expect(fullJourney.removeBranch(-1)).toBe(fullJourney);
    expect(fullJourney.branches).toHaveLength(1);
    expect(fullJourney).toHaveProperty(
      "branches",
      expect.arrayContaining([expect.any(Branch)])
    );
  });

  it("should export as GeoJSON", () => {
    expect(fullJourney.toGeoJSON()).toStrictEqual(
      fullJourney.toGeoJSON("FeatureCollection")
    );
    expect(fullJourney.toGeoJSON("FeatureCollection")).toMatchSnapshot();

    expect(fullJourney.toGeoJSON("MultiLineString")).toStrictEqual(
      fullJourney.toGeoJSON("Feature")
    );
    expect(fullJourney.toGeoJSON("Feature")).toMatchSnapshot();

    expect(fullJourney.toGeoJSON("MultiPolygon")).toMatchSnapshot();
  });

  it("should export as JSON", () => {
    expect(fullJourney.toJSON()).toMatchSnapshot();
  });

  it("should import as JSON", () => {
    expect(Journey.from(fullJourney)).toBe(fullJourney);
    expect(Journey.from(fullJourney.toJSON())).toStrictEqual(fullJourney);
  });
});
