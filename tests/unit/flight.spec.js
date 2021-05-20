import { Flight } from "@/models/Flight.js";
import { Location } from "@/models/Waypoint.js";
import { Model } from "../../src/models/Base";

import theFlight from "../flight.json";

describe("flight", () => {
  it("extends Model", () => {
    expect(Flight.prototype).toBeInstanceOf(Model);
  });
  it("create with defaults", () => {
    expect(new Flight()).toHaveProperty("name", undefined);
    expect(new Flight()).toHaveProperty("notes", undefined);
    expect(new Flight()).toHaveProperty("checked", expect.any(Array));
    expect(new Flight()).toHaveProperty(
      "locations",
      expect.arrayContaining([])
    );
    expect(new Flight()).toHaveProperty("milestones", expect.any(Array));
  });
  it("create with locations & without properties", () => {
    expect(
      new Flight(
        {},
        new Location(),
        new Location(),
        new Location(),
        new Location()
      )
    ).toHaveProperty("locations", [
      [new Location(), new Location(), new Location(), new Location()]
    ]);
    expect(
      new Flight({}, [
        new Location(),
        new Location(),
        new Location(),
        new Location()
      ])
    ).toHaveProperty("locations", [
      [new Location(), new Location(), new Location(), new Location()]
    ]);
    expect(
      new Flight(
        {},
        [new Location(), new Location()],
        [new Location(), new Location()]
      )
    ).toHaveProperty("locations", [
      [new Location(), new Location()],
      [new Location(), new Location()]
    ]);
  });

  it("create with properties & rejects unvalid property", () => {
    const flight = new Flight({
      name: "test flight",
      notes: "model",
      manufacturer: "some text", //not allowed
      checked: [],
      milestones: []
    });
    expect(flight).toHaveProperty("name", "test flight");
    expect(flight).toHaveProperty("notes", "model");
    expect(flight).toHaveProperty("checked", []);
    expect(flight).toHaveProperty("milestones", []);
    expect(flight).toHaveProperty("locations");

    expect(flight).not.toHaveProperty("manufacturer", "some text");
  });

  it("addLocation", () => {
    expect(
      new Flight({}, new Location(0, 0)).addLocation(new Location(1, 1))
    ).toHaveProperty("locations", [[new Location(0, 0), new Location(1, 1)]]);
  });

  it("addTrace", () => {
    expect(
      new Flight().addTrace(new Location(0, 0), new Location(1, 1))
    ).toHaveProperty("locations", [[new Location(0, 0), new Location(1, 1)]]);
    expect(
      new Flight().addTrace([new Location(0, 0), new Location(1, 1)])
    ).toHaveProperty("locations", [[new Location(0, 0), new Location(1, 1)]]);
  });

  it("return trace as a multiArray of latitude, longitude, altitude", () => {
    expect(
      new Flight(
        {},
        [new Location(-1, 0, 0), new Location(0, 1, 1)],
        [new Location(0, -1, 1), new Location(1, 1, 0)]
      ).geom
    ).toStrictEqual([
      [
        [-1, 0, 0],
        [0, 1, 1]
      ],
      [
        [0, -1, 1],
        [1, 1, 0]
      ]
    ]);
  });

  it("return a GeoJSON object", () => {
    let testFlight = new Flight({ name: "test flight", notes: "short one" }, [
      [new Location(-1, 0, 0), new Location(0, 1, 1)],
      [new Location(0, -1, 1), new Location(1, 1, 0)]
    ]);
    expect(testFlight.toGeoJSON("MultiPoint")).toStrictEqual({
      type: "MultiPoint",
      coordinates: [
        [-1, 0, 0],
        [0, 1, 1],
        [0, -1, 1],
        [1, 1, 0]
      ]
    });
    expect(testFlight.toGeoJSON("MultiLineString")).toStrictEqual({
      type: "MultiLineString",
      coordinates: [
        [
          [-1, 0, 0],
          [0, 1, 1]
        ],
        [
          [0, -1, 1],
          [1, 1, 0]
        ]
      ]
    });
    expect(testFlight.toGeoJSON("Feature")).toStrictEqual({
      type: "Feature",
      properties: {
        checked: [],
        milestones: [],
        name: "test flight",
        notes: "short one"
      },
      geometry: {
        type: "MultiLineString",
        coordinates: [
          [
            [-1, 0, 0],
            [0, 1, 1]
          ],
          [
            [0, -1, 1],
            [1, 1, 0]
          ]
        ]
      }
    });
    expect(testFlight.toGeoJSON()).toStrictEqual(
      testFlight.toGeoJSON("Feature")
    );
  });

  it("calculate bounds of trace", () => {
    expect(
      new Flight({ name: "test flight", notes: "short one" }, [
        [new Location(-1, 0, 0), new Location(0, 1, 1)],
        [new Location(0, -1, 1), new Location(1, 1, 0)]
      ]).toBounds()
    ).toStrictEqual([
      [-1, -1],
      [1, 1]
    ]);
  });

  it.todo("duration");

  it("create a Flight from literal", () => {
    let anyFlight = new Flight();

    expect(() => Flight.from({})).toThrow(
      "Invalid data : 'type' should be 'Flight' got 'undefined'"
    );

    expect(Flight.from(anyFlight)).toBe(anyFlight);
    expect(Flight.from(theFlight)).toStrictEqual(theFlight);
  });
});
