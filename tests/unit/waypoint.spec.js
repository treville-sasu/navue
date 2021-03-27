/* eslint-disable jest/no-hooks */
import { Waypoint, Location } from "@/models/Waypoint.js";
import LatLon from "geodesy/latlon-spherical.js";
import { Altitude, Speed, Azimuth } from "../../src/models/Quantities";

describe("waypoint", () => {
  it("create Waypoint with defaults", () => {
    expect(new Waypoint()).toMatchObject({
      latitude: undefined,
      longitude: undefined,
      altitude: undefined,
      name: undefined,
      notes: undefined
    });
  });
  it("create Waypoint with properties", () => {
    expect(new Waypoint(0, 0, 1, "Echo", "Some note")).toMatchObject({
      name: "Echo",
      latitude: 0,
      longitude: 0,
      altitude: new Altitude(1),
      notes: "Some note"
    });
  });
  it("import Waypoint from object or return it if object is Waypoint", () => {
    expect(
      Waypoint.from({
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
        name: "null Island",
        latitude: 0,
        longitude: 0
      });

      expect(wp.toGeoJSON()).toEqual({
        type: "Feature",
        properties: { name: "null Island" },
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
  it("creates Location with defaults", () => {
    expect(new Location()).toMatchObject({
      type: "location",
      latitude: undefined,
      longitude: undefined,
      altitude: undefined,
      name: undefined,
      notes: undefined,
      timestamp: undefined,
      accuracy: undefined,
      heading: undefined,
      speed: undefined,
      verticalSpeed: undefined
    });
  });
  it("creates with properties", () => {
    expect(
      new Location(
        0,
        0,
        1,
        20,
        undefined,
        undefined,
        undefined,
        Date.now,
        "Echo",
        "Some note"
      )
    ).toMatchObject({
      latitude: 0,
      longitude: 0,
      accuracy: 20,
      altitude: new Altitude(1),
      name: "Echo",
      notes: "Some note"
    });
  });
  it("imports from object", () => {
    expect(
      Location.from({
        latitude: 0,
        longitude: 0,
        accuracy: 100,
        altitude: { value: 10, unit: "m", reference: "WGS84" },
        speed: { value: 10 },
        verticalSpeed: { value: 0.0508001016002032, unit: "ft/min" },
        timestamp: 1000
      })
    ).toMatchObject({
      latitude: 0,
      longitude: 0,
      accuracy: 100,
      altitude: new Altitude(10, "m", "WGS84"),
      speed: new Speed(10),
      verticalSpeed: new Speed(10, "ft/min"),
      timestamp: 1000
    });
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
    ).toMatchObject({
      latitude: 0,
      longitude: 0,
      accuracy: 100,
      altitude: new Altitude(10, "m", "WGS84", { accuracy: 10 }),
      speed: new Speed(10, "m/s"),
      timestamp: 1234567890
    });
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
    ).toMatchObject({
      latitude: 0,
      longitude: 0,
      accuracy: 100,
      altitude: new Altitude(10, "m", "WGS84", { accuracy: 10 }),
      speed: new Speed(10, "m/s"),
      timestamp: 1234567890
    });
  });

  it("computes movements from last Location", () => {
    const location = Location.from({
      latitude: 0,
      longitude: 0,
      altitude: { value: 10, unit: "m", reference: "WGS84" },
      timestamp: 1000
    });

    expect(
      location.movementFrom(
        Location.from({
          latitude: 1,
          longitude: 0,
          altitude: { value: 0, unit: "m", reference: "WGS84" },
          timestamp: 0
        })
      )
    ).toMatchObject({
      heading: new Azimuth(180, "°"),
      speed: new Speed(111194.92664455874),
      verticalSpeed: new Speed(10)
    });
    expect(() =>
      location.movementFrom(
        Location.from({
          latitude: 1,
          longitude: 0
        })
      )
    ).toThrow;
  });

  it("gives a bounding box from accuracy or arguents", () => {
    expect(
      Location.from({ latitude: 0, longitude: 0, accuracy: 100 }).toBounds()
    ).toEqual([
      [-0.0004491576385357491, -0.0004491576385357491],
      [0.0004491576385357491, 0.0004491576385357491]
    ]);
    expect(
      Location.from({ latitude: 0, longitude: 0, accuracy: 1 }).toBounds(100)
    ).toEqual([
      [-0.0004491576385357491, -0.0004491576385357491],
      [0.0004491576385357491, 0.0004491576385357491]
    ]);
    expect(Location.from({ latitude: 0, longitude: 0 }).toBounds(100)).toEqual([
      [-0.0004491576385357491, -0.0004491576385357491],
      [0.0004491576385357491, 0.0004491576385357491]
    ]);
  });

  it("provide a new position, in seconds, for a constante course", () => {
    expect(() => {
      Location.from({
        latitude: 0,
        longitude: 0
      }).positionInSeconds(60);
    }).toThrow(
      "cannot calculate futur position, speed & heading should be provided"
    );
    expect(() => {
      Location.from({
        latitude: 0,
        longitude: 0,
        speed: 1
      }).positionInSeconds(60);
    }).toThrow(
      "cannot calculate futur position, speed & heading should be provided"
    );

    expect(
      Location.from({
        latitude: 0,
        longitude: 0,
        speed: 100,
        heading: 180
      }).positionInSeconds(60)
    ).toEqual(new Location(0, 0));
  });
});

//TODO: spec Import methods
