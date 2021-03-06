import { Location } from "@/models/Waypoint.js";
import { UIHelpers } from "@/mixins/apputils";

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
        location = Location.fromLocate(
          this._fakeLocation({
            ...location,
            accuracy: this.settings.maxAccuracy / 2
          })
        );
      }
      ///////////////////

      if (location.accuracy > this.settings.maxAccuracy) {
        this._locationError({
          location,
          code: 99,
          message: `Geolocation error: too low accuracy (${location.accuracy})`
        });
        return;
      }

      // // now we have a location, let's polish it & use it.
      if (
        this.currentLocation instanceof Location &&
        location.distanceTo(this.currentLocation) <= this.settings.minDistance
      )
        return;

      if (
        location.altitude &&
        location.altitude.accuracy > this.settings.maxAccuracy
      )
        location.altitude = undefined;

      if (location.speed < this.settings.minSpeed) {
        location.speed = undefined;
        location.heading = undefined;
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

    _fakeLocation({
      latitude = 0,
      longitude = 0,
      accuracy = 20,
      altitude = 1000,
      speed = 50,
      heading = 0
    }) {
      console.debug("Faking around");

      let rand = (s = 1) => {
        return (Math.random() - 0.5) * s;
      };

      return {
        latitude: latitude + rand(0.3),
        longitude: longitude + rand(0.3),
        accuracy: accuracy + rand(),
        altitude: altitude + rand(100),
        altitudeAccuracy: accuracy + rand(),
        heading: heading + rand(180),
        speed: speed + rand(),
        timestamp: Date.now()
      };
    }
  }
};
