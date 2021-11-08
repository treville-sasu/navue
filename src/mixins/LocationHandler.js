import { Location } from "@/models/Location";
import { Altitude, Distance } from "@/models/Quantities";
import { UIHelpers } from "@/mixins/apputils";
import { randomPosition } from "@turf/random";
export const LocationHandler = {
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
      }
    };
  },
  beforeDestroy() {
    this.stopLocate();
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
