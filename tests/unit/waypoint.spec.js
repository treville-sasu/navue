/* eslint-disable jest/no-hooks */
import { Waypoint, Location } from "@/models/Waypoint.js";
import LatLon from "geodesy/latlon-spherical.js";
import {
  Distance,
  Altitude,
  Speed,
  Azimuth
} from "../../src/models/Quantities";

expect.extend({
  toBeClose(actual, expected, precision = 2) {
    const pass = Math.abs(expected - actual) < Math.pow(10, -precision) / 2;
    if (pass) {
      return {
        message: () => `expected ${actual} not to be close ${expected}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${actual} to be close ${expected}`,
        pass: false
      };
    }
  }
});

describe("waypoint", () => {
  it("create Waypoint with defaults", () => {
    expect(new Waypoint()).toMatchObject({
      latitude: undefined,
      longitude: undefined,
      altitude: undefined
    });
  });
  it("create Waypoint with properties", () => {
    expect(
      new Waypoint(0, 0, 1, { name: "Echo", notes: "Some note" })
    ).toMatchObject({
      latitude: 0,
      longitude: 0,
      altitude: new Altitude(1),
      name: "Echo",
      notes: "Some note"
    });
  });
  it("import Waypoint from object or return it if object is Waypoint", () => {
    expect(
      Waypoint.from({
        type: "Waypoint",
        latitude: 0,
        longitude: 0,
        altitude: { value: 1 },
        name: "Echo",
        notes: "Some note"
      })
    ).toMatchObject({
      latitude: 0,
      longitude: 0,
      altitude: new Altitude(1),
      name: "Echo",
      notes: "Some note"
    });

    expect(
      Waypoint.from({
        type: "Waypoint",
        latlng: { lat: 0, lng: 0 }
      })
    ).toMatchObject({
      latitude: 0,
      longitude: 0
    });
    let wp = new Waypoint();
    expect(Waypoint.from(wp)).toBe(wp);
  });
  it("accepts and return latlng property", () => {
    const wp = new Waypoint();
    wp.latlng = { lat: 0, lng: 0 };
    expect(wp).toMatchObject({
      latitude: 0,
      longitude: 0
    });

    expect(new Waypoint(0, 0).latlng).toMatchObject({ lat: 0, lng: 0 });
  });
  it("hold a LatLon point object", () => {
    expect(new Waypoint(0, 0).point).toMatchObject(new LatLon(0, 0));
  });
  describe("with LatLon invocation", () => {
    let mockrhumbDistanceTo,
      mockrhumbBearingTo,
      mockrhumbDestinationPoint,
      mocktoGeoJSON;
    beforeEach(() => {
      mockrhumbDistanceTo = jest.spyOn(LatLon.prototype, "rhumbDistanceTo");
      mockrhumbBearingTo = jest.spyOn(LatLon.prototype, "rhumbBearingTo");
      mockrhumbDestinationPoint = jest.spyOn(
        LatLon.prototype,
        "rhumbDestinationPoint"
      );
      mocktoGeoJSON = jest.spyOn(LatLon.prototype, "toGeoJSON");
    });

    afterEach(() => {
      mockrhumbDistanceTo.mockRestore();
      mockrhumbBearingTo.mockRestore();
      mockrhumbDestinationPoint.mockRestore();
      mocktoGeoJSON.mockRestore();
    });

    it("call LatLon methods for calculations", () => {
      const wp = new Waypoint(0, 0);
      const otherWp = new Waypoint(1, 1);
      wp.distanceTo(otherWp);
      expect(wp.point.rhumbDistanceTo).toHaveBeenCalledWith(otherWp.point);
      wp.bearingTo(otherWp);
      expect(wp.point.rhumbBearingTo).toHaveBeenCalledWith(otherWp.point);
      wp.destinationPoint(1, 45);
      expect(wp.point.rhumbDestinationPoint).toHaveBeenCalledWith(1, 45);
    });

    it("export to GeoJSON as a Feature", () => {
      const wp = Waypoint.from({
        type: "Waypoint",
        name: "null Island",
        latitude: 0,
        longitude: 0
      });

      expect(wp.toGeoJSON()).toStrictEqual({
        type: "Feature",
        properties: { altitude: undefined, name: "null Island" },
        geometry: {
          type: "Point",
          coordinates: [0, 0]
        }
      });
      expect(wp.point.toGeoJSON).toHaveBeenCalled();
    });
  });
});

describe("location", () => {
  it("creates with defaults", () => {
    expect(new Location()).toMatchObject({
      latitude: undefined,
      longitude: undefined,
      altitude: undefined,
      timestamp: undefined,
      accuracy: undefined,
      heading: undefined,
      speed: undefined,
      verticalSpeed: undefined
    });
  });

  it("creates with properties", () => {
    expect(
      new Location(0, 0, 1, {
        accuracy: 20,
        timestamp: Date.now(),
        name: "Echo",
        notes: "Some note"
      })
    ).toMatchObject({
      latitude: 0,
      longitude: 0,
      altitude: new Altitude(1),
      accuracy: 20,
      timestamp: expect.any(Number),
      name: "Echo",
      notes: "Some note"
    });
  });

  it("imports from literal", () => {
    expect(
      Location.from({
        type: "Location",
        latitude: 0,
        longitude: 0,
        altitude: { value: 10, unit: "m", reference: "WGS84" },
        accuracy: { type: "Distance", unit: "m", value: 100 },
        verticalSpeed: { value: 10, unit: "ft/min" },
        speed: { value: 10 },
        heading: { value: 180, unit: "°" },
        timestamp: 1000
      })
    ).toStrictEqual(
      new Location(0, 0, new Altitude(10, "m", { reference: "WGS84" }), {
        accuracy: new Distance(100, "m"),
        verticalSpeed: new Speed(10, "ft/min"),
        speed: new Speed(10),
        heading: new Azimuth(180, "°"),
        timestamp: 1000
      })
    );
  });
  it("imports from GeolocationPosition", () => {
    expect(
      Location.fromGeolocationPosition({
        coords: {
          latitude: 0,
          longitude: 0,
          altitude: 10,
          accuracy: 100,
          altitudeAccuracy: 10,
          heading: 270,
          speed: 10
        },
        timestamp: 1234567890
      })
    ).toStrictEqual(
      new Location(
        0,
        0,
        new Altitude(10, "m", { reference: "WGS84", accuracy: 10 }),
        {
          accuracy: new Distance(100, "m"),
          speed: new Speed(10, "m/s"),
          heading: new Azimuth(270, "°"),
          timestamp: 1234567890
        }
      )
    );
  });
  it("imports from Locate (Leaflet LocationEvent)", () => {
    expect(
      Location.fromLocate({
        latitude: 0,
        longitude: 0,
        altitude: 10,
        accuracy: 100,
        altitudeAccuracy: 10,
        heading: 270,
        speed: 10,
        timestamp: 1234567890
      })
    ).toStrictEqual(
      new Location(
        0,
        0,
        new Altitude(10, "m", { reference: "WGS84", accuracy: 10 }),
        {
          accuracy: new Distance(100, "m"),
          speed: new Speed(10, "m/s"),
          heading: new Azimuth(270, "°"),
          timestamp: 1234567890
        }
      )
    );
  });

  it("computes movements from last Location", () => {
    const location = Location.from({
      type: "Location",
      latitude: 0,
      longitude: 0,
      altitude: { value: 10, unit: "m", reference: "WGS84" },
      timestamp: 1000
    });

    expect(
      location.movementFrom(
        Location.from({
          type: "Location",
          latitude: 1,
          longitude: 0,
          altitude: { value: 0, unit: "m", reference: "WGS84" },
          timestamp: 0
        })
      )
    ).toStrictEqual({
      heading: new Azimuth(180, "°", { _precision: 3 }),
      speed: new Speed(111194.92664455874),
      verticalSpeed: new Speed(10)
    });
    expect(() =>
      location.movementFrom(
        Location.from({
          type: "Location",
          latitude: 1,
          longitude: 0
        })
      )
    ).toThrow;
  });

  it("gives a bounding box from accuracy or arguents", () => {
    expect(
      Location.from({
        type: "Location",
        latitude: 0,
        longitude: 0,
        accuracy: 100
      }).toBounds()
    ).toEqual([
      [-0.0004491576385357491, -0.0004491576385357491],
      [0.0004491576385357491, 0.0004491576385357491]
    ]);
    expect(
      Location.from({
        type: "Location",
        latitude: 0,
        longitude: 0,
        accuracy: 1
      }).toBounds(100)
    ).toEqual([
      [-0.0004491576385357491, -0.0004491576385357491],
      [0.0004491576385357491, 0.0004491576385357491]
    ]);
    expect(
      Location.from({ type: "Location", latitude: 0, longitude: 0 }).toBounds(
        100
      )
    ).toEqual([
      [-0.0004491576385357491, -0.0004491576385357491],
      [0.0004491576385357491, 0.0004491576385357491]
    ]);
  });

  it("provide a new position, in seconds, for a constant course", () => {
    expect(() => {
      Location.from({
        type: "Location",
        latitude: 0,
        longitude: 0
      }).positionInSeconds(60);
    }).toThrow(
      "cannot calculate futur position, speed & heading should be provided"
    );
    expect(() => {
      Location.from({
        type: "Location",
        latitude: 0,
        longitude: 0,
        speed: { value: 100 }
      }).positionInSeconds(60);
    }).toThrow(
      "cannot calculate futur position, speed & heading should be provided"
    );

    expect(
      Location.from({
        type: "Location",
        latitude: 0,
        longitude: 0,
        speed: { value: 111.32 },
        heading: { value: 0, unit: "°" }
      }).positionInSeconds(10)
    ).toMatchObject({
      latitude: expect.toBeClose(0.01, 4),
      longitude: expect.toBeClose(0, 4)
    });

    expect(
      Location.from({
        type: "Location",
        latitude: 0,
        longitude: 0,
        speed: { value: 111.32 },
        heading: { value: 90, unit: "°" }
      }).positionInSeconds(10)
    ).toMatchObject({
      latitude: expect.toBeClose(0, 4),
      longitude: expect.toBeClose(0.01, 4)
    });
  });
});
