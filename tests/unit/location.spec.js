/* eslint-disable jest/no-hooks */
import { Waypoint } from "@/models/Waypoint";
import { Location } from "@/models/Location";
import { Distance, Speed, Azimuth } from "@/models/Quantities";

describe("location", () => {
  let location;

  beforeEach(() => {
    location = new Location([0, 0, 0], {
      accuracy: new Distance(20),
      timestamp: 1234567890,
      name: "Echo",
      notes: "Some note"
    });
  });

  it("extends Waypoint", () => {
    expect(Location.prototype).toBeInstanceOf(Waypoint);
  });

  it("is instantiated", () => {
    expect(() => new Location()).toThrowError();
    expect(() => new Location("aaaa")).toThrowError();
    expect(location).toMatchSnapshot();
  });

  it("return a bounding box from accuracy", () => {
    expect(location.bbox).toMatchSnapshot();
  });

  it("return a bounding box from radius", () => {
    expect(location.bounds(200)).toMatchSnapshot();
  });

  it("return a futur location in time (seconds later)", () => {
    expect(() => {
      location.willBeIn(60);
    }).toThrow(
      "cannot calculate futur position, speed & heading should be provided"
    );

    location.properties.speed = new Speed(10);
    expect(() => {
      location.willBeIn(60);
    }).toThrow(
      "cannot calculate futur position, speed & heading should be provided"
    );

    location.properties.heading = new Azimuth(90);
    expect(location.willBeIn(60)).toMatchSnapshot();
  });

  it("retun a leg from other position", () => {
    const prevLocation = new Location([1, 1, 1], {
      accuracy: new Distance(20),
      timestamp: 1234567890
    });

    expect(() => location.legFrom(prevLocation)).toThrow(
      "Teleportation is not yet a possibility"
    );

    prevLocation.properties.timestamp -= 10000;

    expect(location.legFrom(prevLocation)).toMatchInlineSnapshot(`
      Object {
        "distance": Object {
          "precision": 5,
          "type": "Distance",
          "unit": "m",
          "value": 157250,
        },
        "heading": Object {
          "precision": 16,
          "type": "Azimuth",
          "unit": "°",
          "value": 224.9985454851105,
        },
        "speed": Object {
          "precision": 5,
          "type": "Speed",
          "unit": "m/s",
          "value": 15725,
        },
        "verticalSpeed": Object {
          "precision": 1,
          "type": "Speed",
          "unit": "m/s",
          "value": -0.1,
        },
      }
    `);
  });

  it("imports from literal", () => {
    expect(
      Location.from({
        longitude: 0,
        latitude: 43,
        altitude: {
          accuracy: 50,
          reference: "WGS84",
          value: 1000,
          unit: "m",
          type: "Altitude"
        },
        accuracy: {
          value: 100,
          unit: "m",
          type: "Distance"
        },
        speed: {
          value: 10,
          unit: "m/s",
          type: "Speed"
        },
        heading: {
          value: 180,
          unit: "°",
          type: "Azimuth"
        },
        timestamp: 1620672163861,
        type: "Location",
        _id: "1620672163861",
        _rev: "1-ad4a6ac12faa5c391774a3120af8c39d"
      })
    ).toMatchSnapshot();
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
    ).toMatchSnapshot();
  });
});
