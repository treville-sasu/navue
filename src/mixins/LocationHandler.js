import { Location } from "@/models/Location";
import { UIHelpers } from "@/mixins/apputils";

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
          point: {
            type: "symbol",
            filter: [
              "all",
              ["==", ["geometry-type"], "Point"],
              ["has", "timestamp"],
            ],
            layout: {
              "icon-anchor": "center",
              "icon-image": "za-provincial-2", // "it-motorway-2"
              "text-field": ["get", "label"],
              "text-offset": [0, 1.25],
              "text-anchor": "center",
            },
          },
          futurs: {
            type: "symbol",
            filter: [
              "all",
              ["==", ["geometry-type"], "Point"],
              ["!", ["has", "timestamp"]],
            ],
            layout: {
              "icon-anchor": "center",
              "text-anchor": "center",
              "text-justify": "center",
              "icon-image": "circle-white-2",
              "text-field": ["get", "label"],
            },
          },
          course: {
            type: "line",
            filter: ["==", ["geometry-type"], "LineString"],
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": c["warning"],
              "line-width": 6,
              "line-opacity": 0.7,
            },
          },
        },
      },
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
        if (this.currentLocation.moving)
          for (let i = 1; i <= this.settings.futurPositionDelay; i++)
            features.push(
              this.currentLocation.willBeIn(2 ** i * 60, { label: 2 ** i })
            );
        if (features.length > 1)
          features.push(
            lineString(features.map(({ geometry: { coordinates } }) => coordinates))
          );
        return featureCollection(features);
      } else return undefined;
    },
  },
  methods: {
    stopLocate() {
      this.currentLocation = undefined;

      if (navigator.geolocation && navigator.geolocation.clearWatch)
        navigator.geolocation.clearWatch(this._locationWatchId);
    },
    startLocate() {
      if (!("geolocation" in navigator)) {
        this._locationError({
          code: 0,
          message: "Geolocation not supported by your device.",
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
      let location = Location.fromGeolocationPosition(e);

      ////////////////// strip this for production
      if (process.env.NODE_ENV == "development")
        location = this._fakeLocation(location);
      ///////////////////

      if (location.properties.accuracy > this.settings.maxAccuracy) {
        this._locationError({
          location,
          code: 99,
          message: `Geolocation error: too low accuracy (${location.properties.accuracy})`,
        });
        return;
      }

      if (
        location.properties.speed < this.settings.minSpeed ||
        (this.currentLocation instanceof Location &&
          location.distanceTo(this.currentLocation) <=
          this.settings.minDistance)
      ) {
        location.properties.speed = undefined;
        location.properties.heading = undefined;
      }

      if (
        location.properties.altitude &&
        location.properties.altitudeAccuracy > this.settings.maxAccuracy
      ) {
        location.properties.altitude = undefined;
        location.properties.altitudeAccuracy = undefined;
      }

      location.properties.elevation = this.map.queryTerrainElevation(
        location.lngLat
      );
      location.properties.elevationReference = "AGL";
      // location.properties.label = ``

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
        onAction: () => (this.settings.getLocation = false),
      });
    },

    _fakeLocation(location) {
      function randomAround(center, spread = 0.05) {
        return center * (1 + spread * (2 * Math.random() - 1));
      }

      const defaults = {
        altitude: 1000,
        speed: 51,
        heading: 180,
      };

      console.warn("Faking around");

      if (this.currentLocation) {
        let heading = randomAround(
          this.currentLocation.properties.heading || defaults.heading
        );
        let speed = randomAround(
          this.currentLocation.properties.speed || defaults.speed
        );
        let distance =
          ((location.properties.timestamp -
            this.currentLocation.properties.timestamp) /
            1000) *
          speed;
        location = this.currentLocation.destinationPoint(distance, heading, {
          ...location.properties,
          heading,
          speed,
        });
      }

      location.properties.accuracy = randomAround(
        this.settings.maxAccuracy / 2
      );
      location.altitude = randomAround(defaults.altitude);
      location.properties.altitudeAccuracy = randomAround(
        this.settings.maxAccuracy / 2
      );
      return location;
    },
  },
};
