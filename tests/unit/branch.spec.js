import { Branch } from "@/models/Branch";
import { Model } from "@/models/Base";

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

describe("branch", () => {
  let empty, branch;

  beforeEach(() => {
    empty = new Branch();

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

  it("is instantiated", () => {
    expect(branch).toHaveProperty("member");
    expect(branch).toHaveProperty("features", expect.any(Array));
    expect(branch).toHaveProperty("properties", { a: 1 });
  });

  it("hold, geom, bbox & length", () => {
    expect(branch.geom).toMatchSnapshot();
    expect(branch.bbox).toMatchSnapshot();
    expect(branch.length).toMatchSnapshot();
  });

  it("should return first & last feature", () => {
    expect(branch.first()).toBe(branch.features[0]);
    expect(branch.last()).toBe(branch.features[branch.features.length - 1]);
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

  it("inserts new position at given index", () => {
    let aPosition = new Position();
    expect(branch.insert(aPosition)).toBe(aPosition);
    expect(branch.last()).toBe(aPosition);

    expect(branch.insert(aPosition, 0)).toBe(aPosition);
    expect(branch.first()).toBe(aPosition);
  });

  it("removes position at given index", () => {
    const aPosition = branch.last();
    expect(branch.last()).toBe(aPosition);
    expect(branch.remove(2)).toBe(2);
    expect(branch.last()).not.toBe(aPosition);
  });

  it("should iterate over pairs", () => {
    expect(branch.pairs((p, c, i) => i)).toEqual([1, 2]);
  });

  it("should export as GeoJSON", () => {
    expect(branch.toGeoJSON("LineString")).toStrictEqual(
      branch.toGeoJSON("Feature")
    );
    expect(branch.toGeoJSON("Feature")).toMatchSnapshot();


    expect(branch.toGeoJSON("FeatureCollection")).toMatchSnapshot();

    expect(branch.toGeoJSON("MultiLineString")).toMatchSnapshot();
    expect(branch.toGeoJSON("Geodesics")).toMatchSnapshot();
    expect(branch.toGeoJSON("Midpoints")).toMatchSnapshot();

    expect(branch.toGeoJSON()).toMatchSnapshot();
  });

  it("should export as JSON", () => {
    expect(branch.toJSON()).toMatchSnapshot();
  });

  it("should import as JSON or GeoJSON", () => {
    expect(Branch.from(empty)).toBe(empty);
    expect(Branch.from(branch.toJSON(), branch.member)).toMatchObject(branch);

    // eslint-disable-next-line no-unused-vars
    let { member, ...almost } = branch;
    expect(Branch.from(branch.toGeoJSON("FeatureCollection"), Position)).toMatchObject(almost);
    expect(Branch.from(branch.toJSON(), Position)).toMatchObject(almost);

    expect(() =>
      Branch.from(Branch.from(branch.toGeoJSON("Feature")))
    ).toThrowError(
      "Invalid data : 'type' should be 'Branch' or 'FeatureCollection' got 'Feature'"
    );
    expect(() => Branch.from({ type: "other" })).toThrowError(
      "Invalid data : 'type' should be 'Branch' or 'FeatureCollection' got 'other'"
    );
  });
});
