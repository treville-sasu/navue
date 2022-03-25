import { Location } from "@/models/Location";
import { Altitude, Distance } from "@/models/Quantities";
import { UIHelpers } from "@/mixins/apputils";
import { randomPosition } from "@turf/random";

import { featureCollection, lineString } from "@turf/helpers";

import c from "@/assets/colors.scss";

export default {
  mixins: [UIHelpers],
  data() {
    return {
      lastError: undefined,
      geoOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      },
      settings: {
        maxAccuracy: 150,
        minSpeed: 0.2,
        minDistance: 1
      },
      style: {
        location: {
          type: "symbol",
          filter: [
            "all",
            ["==", ["geometry-type"], "Point"],
            ["has", "timestamp"]
          ],
          layout: {
            "icon-anchor": "center",
            "icon-image": "za-provincial-2", // "it-motorway-2"
            "text-field": ["get", "label"],
            "text-offset": [0, 1.25],
            "text-anchor": "center"
          }
        },
        futurs: {
          type: "symbol",
          filter: [
            "all",
            ["==", ["geometry-type"], "Point"],
            ["!", ["has", "timestamp"]]
          ],
          layout: {
            "icon-anchor": "center",
            "text-anchor": "center",
            "text-justify": "center",
            "icon-image": "circle-white-2",
            "text-field": ["get", "label"]
            // "icon-text-fit": "both"
          }
        },
        course: {
          type: "line",
          filter: ["==", ["geometry-type"], "LineString"],
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": c["warning"],
            "line-width": 6,
            "line-opacity": 0.7
            // "line-dasharray": [2, 4]
          }
        }
      }
    };
  },
  beforeDestroy() {
    this.stopLocate();
  },
  computed: {
    flightCourse() {
      if (this.currentLocation) {
        let features = [];
        features.push(this.currentLocation);
        for (let i = 1; i <= this.settings.futurPositionDelay; i++)
          //FIXME this dirty hack with a condition
          try {
            features.push(
              this.currentLocation.willBeIn(2 ** i * 60, { label: 2 ** i })
            );
            // eslint-disable-next-line no-empty
          } catch { }
        if (features.length > 1)
          features.push(lineString(features.map(f => f.geometry.coordinates)));
        return featureCollection(features);
      } else return undefined;
    }
  },
  methods: {
    stopLocate() {
      this.currentLocation = undefined;

      if (navigator.geolocation && navigator.geolocation.clearWatch) {
        navigator.geolocation.clearWatch(this._locationWatchId);
      }
    },
    startLocate() {
      if (!("geolocation" in navigator)) {
        this._locationError({
          code: 0,
          message: "Geolocation not supported by your device."
        });
        return this;
      }

      this._locationWatchId = navigator.geolocation.watchPosition(
        this._locationFound,
        this._locationError,
        this.geoOptions
      );
    },

    _locationFound(e) {
      console.time("location");
      let location = Location.fromGeolocationPosition(e);
      //////////////////
      if (process.env.NODE_ENV == "development") {
        location = this._fakeLocation(location, {
          accuracy: new Distance(this.settings.maxAccuracy / 2),
          altitude: new Altitude(1000 + Math.random() * 200, "ft", {
            reference: "WGS84"
          })
        });
      }
      ///////////////////

      if (location.properties.accuracy > this.settings.maxAccuracy) {
        this._locationError({
          location,
          code: 99,
          message: `Geolocation error: too low accuracy (${location.properties.accuracy})`
        });
        return;
      }

      if (
        this.currentLocation instanceof Location &&
        location.distanceTo(this.currentLocation) <= this.settings.minDistance
      )
        return;

      if (
        location.properties.altitude &&
        location.properties.altitude.accuracy > this.settings.maxAccuracy
      )
        location.properties.altitude = undefined;

      if (location.properties.speed < this.settings.minSpeed) {
        location.properties.speed = undefined;
        location.properties.heading = undefined;
      }

      // location.properties.elevation = new Altitude(
      //   this.map.queryTerrainElevation(location.lngLat),
      //   "m",
      //   {
      //     reference: "WGS84"
      //   }
      // );

      this.lastError = undefined;
      this.currentLocation = location;
    },

    _locationError({ message, code }) {
      if (process.env.NODE_ENV == "development") console.error(arguments[0]);

      switch (code) {
        case 0: //
        case 1: //PERMISSION_DENIED
          message =
            "You should grant location access in order use these feature. Please change your browser settings";
          break;
        case 2: // POSITION_UNAVAILABLE
          message = "Your device can't find your position right now.";
          break;
        case 3: // TIMEOUT
          message = "Last known position too old.";
          break;
        // case 99: // LOWACCURACY
      }

      if (this.settings.inFlight && this.lastError == code) this.newLeg();
      this.lastError = code;

      this.openWarning({
        message,
        actionText: "Stop GNSS",
        onAction: () => (this.settings.getLocation = false)
      });
    },

    _fakeLocation(location, properties) {
      console.debug("Faking around");

      location.properties = {
        timestamp: Date.now(),
        ...location.properties,
        ...properties
      };
      location.geometry.coordinates = randomPosition(location.bbox);

      if (this.currentLocation) {
        location.properties = {
          ...location.properties,
          ...location.legFrom(this.currentLocation)
        };
      }

      if (location.properties.altitude)
        location.altitude = location.properties.altitude;

      return location;
    }
  }
};
