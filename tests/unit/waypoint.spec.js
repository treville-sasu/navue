/* eslint-disable jest/no-hooks */
import { Model } from "@/models/Base.js";
import { Waypoint } from "@/models/Waypoint.js";
import { Altitude, Distance, Bearing } from "../../src/models/Quantities";

expect.extend({
  toBeClose(actual, expected, precision = 2) {
    const pass = Math.abs(expected - actual) < Math.pow(10, -precision) / 2;
    if (pass) {
      return {
        message: () => `expected ${actual} not to be close ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${actual} to be close ${expected}`,
        pass: false,
      };
    }
  },
});

describe("waypoint", () => {
  let wp;
  beforeEach(() => {
    wp = new Waypoint([1.123456789, 1.123456789, 1234.56789], {
      name: "Echo",
      notes: "Some note",
    });
  });
  it("extends Model", () => {
    expect(Waypoint.prototype).toBeInstanceOf(Model);
  });
  it("is instantiated", () => {
    expect(() => new Waypoint()).toThrowError();
    expect(() => new Waypoint("aaaa")).toThrowError();

    expect(wp).toMatchInlineSnapshot(`
      Object {
        "geometry": Object {
          "coordinates": Array [
            1.123457,
            1.123457,
            1235,
          ],
          "type": "Point",
        },
        "properties": Object {
          "altitudeReference": "WGS84",
          "name": "Echo",
          "notes": "Some note",
        },
        "type": "Waypoint",
      }
    `);
  });
  // describe("getter & setter", () => {

  it("handles longitude, latitude & lngLat (with rounding, 0.000001°)", () => {
    wp.longitude = 2.123456789;
    expect(wp.geometry.coordinates[0]).toBe(2.123457);
    wp.latitude = 2.123456789;
    expect(wp.geometry.coordinates[1]).toBe(2.123457);

    wp.lngLat = { lat: 1.123456789, lng: 1.123456789 };
    expect(wp.geometry).toMatchInlineSnapshot(`
      Object {
        "coordinates": Array [
          1.123457,
          1.123457,
          1235,
        ],
        "type": "Point",
      }
    `);
    expect(wp.lngLat).toMatchInlineSnapshot(`
      Object {
        "lat": 1.123457,
        "lng": 1.123457,
      }
    `);
  });

  it("handles altitude (with rounding, 1m)", () => {
    wp.altitude = 1.123456789;
    expect(wp.geometry.coordinates[2]).toBe(1);
    expect(wp.altitude).toBe(wp.geometry.coordinates[2]);
  });

  it("get distance to other", () => {
    expect(wp.distanceTo(new Waypoint([1, 1]))).toMatchInlineSnapshot(`19412`);
  });
  it("get a bearing to other", () => {
    expect(
      new Waypoint([0, 0]).bearingTo(new Waypoint([0, 1]))
    ).toMatchInlineSnapshot(`0`);
  });
  it("get destination waypoint from distance and bearing", () => {
    expect(
      new Waypoint([0, 0, 1]).destinationPoint(
        new Distance(157249),
        new Bearing(0)
      )
    ).toMatchSnapshot();
    expect(new Waypoint([0, 0]).destinationPoint(157249, 0)).toMatchObject(
      new Waypoint([0, 0]).destinationPoint(157249, 0)
    );
  });
  it.todo("return a Great Circle");

  it("is exported as JSON object", () => {
    expect(wp.toJSON()).toMatchSnapshot();
  });

  it("is exported as GeoJSON Position, or Point & Feature", () => {
    expect(wp.toGeoJSON("Position")).toMatchSnapshot();
    expect(wp.toGeoJSON("Point")).toMatchSnapshot();
    expect(wp.toGeoJSON()).toMatchSnapshot();
  });

  it("is imported from GeoJSON Position, Point & Feature, or plain Waypoint object", () => {
    expect(Waypoint.from(wp.toJSON())).toMatchObject(wp);
    expect(Waypoint.from(wp.toGeoJSON("Point"))).toMatchObject(
      new Waypoint(wp.geometry.coordinates)
    );
    expect(Waypoint.from(wp.toGeoJSON())).toMatchObject(wp);
    expect(() => Waypoint.from({ type: "Polyline" })).toThrow(
      "Invalid data : 'type' should be 'Feature', 'Point' or 'Waypoint' got 'Polyline'"
    );
  });
  it.skip("is imported from (mapbox), event", () => {
    expect(
      Waypoint.fromEvent({
        type: "click",
        lngLat: { lng: 1.123456789, lat: 1.123456789 },
      })
    ).toMatchObject(wp);
  });
});
