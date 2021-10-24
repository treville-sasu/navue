/* eslint-disable jest/no-hooks */
import { Model } from "@/models/Base.js";
import { Waypoint } from "@/models/Waypoint.js";
import { Altitude } from "../../src/models/Quantities";

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
  let wp;
  beforeEach(() => {
    wp = new Waypoint([1.123456789, 1.123456789, 1234.56789], {
      name: "Echo",
      notes: "Some note"
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
          "altitude": Object {
            "precision": 9,
            "reference": undefined,
            "type": "Altitude",
            "unit": "m",
            "value": 1234.56789,
          },
          "name": "Echo",
          "notes": "Some note",
        },
        "type": "Waypoint",
      }
    `);
  });
  // describe("getter & setter", () => {

  it("longitude, latitude & lngLat (with rounding, 0.000001°)", () => {
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

  it("altitude (with rounding, 1m)", () => {
    const alt = new Altitude(1.123456789);
    wp.altitude = alt;
    expect(wp.geometry.coordinates[2]).toBe(1);
    expect(wp.properties.altitude).toBe(alt);
    expect(wp.altitude).toBe(alt);

    wp.altitude = 2.123456789;
    expect(wp.geometry.coordinates[2]).toBe(2);
    expect(wp.altitude).toMatchInlineSnapshot(`
      Object {
        "precision": 1,
        "reference": undefined,
        "type": "Altitude",
        "unit": "m",
        "value": 2.123456789,
      }
    `);

    expect(() => {
      wp.altitude = "anything";
    }).toThrowError();
  });
  // });

  it("get distance to other", () => {
    expect(wp.distanceTo(new Waypoint([1, 1]))).toMatchInlineSnapshot(`
      Object {
        "precision": 5,
        "type": "Distance",
        "unit": "m",
        "value": 19412,
      }
    `);
  });
  it("get bearing to other", () => {
    expect(new Waypoint([0, 0]).bearingTo(new Waypoint([0, 1])))
      .toMatchInlineSnapshot(`
      Object {
        "precision": 0,
        "type": "Azimuth",
        "unit": "°",
        "value": 0,
      }
    `);
  });
  it("get other from distance and bearing", () => {
    expect(new Waypoint([0, 0]).destinationPoint(157249, 0)).toMatchSnapshot();
  });

  // describe("getter & setter", () => {
  it("is exported as JSON object", () => {
    expect(wp.toJSON()).toMatchSnapshot();
  });

  it("is exported as GeoJSON Position, or Point & Feature", () => {
    expect(Waypoint.from(wp)).toBe(wp);

    expect(wp.toGeoJSON("Position")).toMatchInlineSnapshot(`
      Array [
        1.123457,
        1.123457,
        1235,
      ]
    `);
    expect(wp.toGeoJSON()).toMatchObject(wp.toGeoJSON("Point"));
    expect(wp.toGeoJSON()).toMatchSnapshot();
  });

  it("is imported from GeoJSON Position, Point & Feature, or plain Waypoint object", () => {
    const geojson = {
      geometry: {
        coordinates: [0, 0, 1],
        type: "Point"
      },
      properties: {
        name: "null Island"
      },
      type: "Feature"
    };
    expect(Waypoint.from(geojson)).toMatchSnapshot();

    expect(Waypoint.from(geojson.geometry)).toMatchSnapshot();

    expect(
      Waypoint.from({
        type: "Waypoint",
        latitude: 0,
        longitude: 0,
        altitude: { type: "Altitude", value: 1 },
        name: "null Island"
      })
    ).toMatchSnapshot();

    expect(
      Waypoint.from({
        type: "Waypoint",
        latitude: 0,
        longitude: 0,
        lngLat: { lat: 1, lng: 1 },
        name: "null Island"
      })
    ).toMatchSnapshot();

    expect(() => Waypoint.from({ type: "Polyline" })).toThrow(
      "Invalid data : 'type' should be 'Feature' or 'Point' or 'Waypoint' got 'Polyline'"
    );
  });

  // });
});
