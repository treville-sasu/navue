/* eslint-disable jest/no-hooks */
import { Waypoint, Location } from "@/models/Waypoint.js";
import LatLon from "geodesy/latlon-spherical.js";

describe("waypoint", () => {
  const defaultObject = {
    name: undefined,
    latitude: undefined,
    longitude: undefined,
    altitude: undefined,
    notes: undefined
  };

  it("create Waypoint with defaults", () => {
    expect(new Waypoint()).toMatchObject(defaultObject);
  });
  it("create Waypoint with properties", () => {
    expect(
      new Waypoint({
        name: "Echo",
        latitude: 0,
        longitude: 0,
        altitude: { value: 0, ref: "AMSL", unit: "m" },
        notes: "Some note"
      })
    ).toMatchObject({
      name: "Echo",
      latitude: 0,
      longitude: 0,
      altitude: { value: 0, ref: "AMSL", unit: "m" },
      notes: "Some note"
    });
  });
  it("create Waypoint rejects not undeclared property", () => {
    expect(
      new Waypoint({
        surname: "kiki"
      })
    ).toMatchObject(defaultObject);
  });
  it("navigation accept and return latlng property", () => {
    expect(
      new Waypoint({
        latlng: { lat: 0, lng: 0 }
      })
    ).toMatchObject({
      ...defaultObject,
      latitude: 0,
      longitude: 0
    });

    const wp = new Waypoint();
    wp.latlng = { lat: 0, lng: 0 };
    expect(wp).toMatchObject({
      ...defaultObject,
      latitude: 0,
      longitude: 0
    });

    expect(
      new Waypoint({
        latitude: 0,
        longitude: 0
      }).latlng
    ).toMatchObject({ lat: 0, lng: 0 });
  });
  it("hold a LatLon point object", () => {
    expect(
      new Waypoint({
        latitude: 0,
        longitude: 0
      }).point
    ).toMatchObject(new LatLon(0, 0));
  });
  describe("with LatLon invocation", () => {
    // const mockrhumbDistanceTo = jest.fn();
    // const mockrhumbBearingTo = jest.fn();
    // const mockrhumbDestinationPoint = jest.fn();
    // const mocktoGeoJSON = jest.fn();

    // jest.mock("geodesy/latlon-spherical.js", () => {
    //   return jest.fn().mockImplementation(() => {
    //     return {
    //       rhumbDistanceTo: mockrhumbDistanceTo,
    //       rhumbBearingTo: mockrhumbBearingTo,
    //       rhumbDestinationPoint: mockrhumbDestinationPoint,
    //       toGeoJSON: mocktoGeoJSON
    //     };
    //   });
    // });
    let mockrhumbDistanceTo, mockrhumbBearingTo, mockrhumbDestinationPoint, mocktoGeoJSON;
    beforeEach(() => {
      mockrhumbDistanceTo = jest.spyOn(LatLon.prototype, "rhumbDistanceTo");
      mockrhumbBearingTo = jest.spyOn(LatLon.prototype, "rhumbBearingTo");
      mockrhumbDestinationPoint = jest.spyOn(LatLon.prototype, "rhumbDestinationPoint");
      mocktoGeoJSON = jest.spyOn(LatLon.prototype, "toGeoJSON");
    });

    afterEach(() => {
      mockrhumbDistanceTo.mockRestore();
      mockrhumbBearingTo.mockRestore();
      mockrhumbDestinationPoint.mockRestore();
      mocktoGeoJSON.mockRestore();
    });
    // beforeEach(() => {
      // LatLon.mockClear();
      // mockrhumbDistanceTo.mockClear();
      // mockrhumbBearingTo.mockClear();
      // mockrhumbDestinationPoint.mockClear();
      // mocktoGeoJSON.mockClear();
    // });

    it("call LatLon methods for calculations", () => {
      const wp = new Waypoint({
        latitude: 0,
        longitude: 0
      });
      const otherWp = new Waypoint({
        latitude: 1,
        longitude: 1
      });
      wp.distanceTo(otherWp);
      expect(wp.point.rhumbDistanceTo).toHaveBeenCalledWith(otherWp.point);
      wp.bearingTo(otherWp);
      expect(wp.point.rhumbBearingTo).toHaveBeenCalledWith(otherWp.point);
      wp.destinationPoint(1, 45);
      expect(wp.point.rhumbDestinationPoint).toHaveBeenCalledWith(1, 45);
    });
    it("export to GeoJSON as a Feature", () => {
      const wp = new Waypoint({
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
  it("computes values from lastLocation", () => {
    const location = new Location({
      latitude: 0,
      longitude: 0,
      altitude: { value: 10, unit: "m", ref: "WGS84" },
      timestamp: 1000
    });

    expect(location.heading).not.toBeDefined();
    expect(location.speed).not.toBeDefined();
    expect(location.verticalSpeed).not.toBeDefined();

    location.computeMovementFrom(
      new Location({
        latitude: 1,
        longitude: 0,
        altitude: { value: 0, unit: "m", ref: "WGS84" },
        timestamp: 0
      })
    );
    expect(location.heading).toBe(180);
    expect(location.speed).toBeCloseTo(111194.9, 1);
    expect(location.verticalSpeed).toBeCloseTo(10, 1);
  });
  // TODO: Should we test if timestmp is undefined ?

  it("gives a bounding box from accuracy or arguents", () => {
    expect(
      new Location({ latitude: 0, longitude: 0, accuracy: 100 }).toBounds()
    ).toEqual([
      [-0.0004491576385357491, -0.0004491576385357491],
      [0.0004491576385357491, 0.0004491576385357491]
    ]);
    expect(
      new Location({ latitude: 0, longitude: 0, accuracy: 1 }).toBounds(100)
    ).toEqual([
      [-0.0004491576385357491, -0.0004491576385357491],
      [0.0004491576385357491, 0.0004491576385357491]
    ]);
    expect(new Location({ latitude: 0, longitude: 0 }).toBounds(100)).toEqual([
      [-0.0004491576385357491, -0.0004491576385357491],
      [0.0004491576385357491, 0.0004491576385357491]
    ]);
  });
});

//TODO: spec Import methods
