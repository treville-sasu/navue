import { Location } from "@/models/Waypoint.js";
import { UIHelpers } from "@/mixins/apputils";

export const MapHandlers = {
  data() {
    return {
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
  mixins: [UIHelpers],
  methods: {
    stopLocate() {
      this.lastKnownLocation = undefined;

      if (navigator.geolocation && navigator.geolocation.clearWatch) {
        navigator.geolocation.clearWatch(this._locationWatchId);
      }
    },
    startLocate() {
      if (!("geolocation" in navigator)) {
        this._locationError({
          code: 0,
          message: "Geolocation not supported."
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
          type: "LocationError",
          code: 99,
          message: `Geolocation error: too low accuracy (${location.accuracy}m)`
        });
        return;
      }

      // // now we have a location, let's polish it & use it.
      if (
        this.lastKnownLocation instanceof Location &&
        location.distanceTo(this.lastKnownLocation) <= this.settings.minDistance
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

      if (this.settings.inFlight) this.addLocation(location);

      this.lastKnowError = undefined;

      const nextDestination = this.getDestination(location);
      if (nextDestination) this.setDestination(nextDestination);

      this.lastKnownLocation = location;
      if (this.settings.setView) this.bestView(location);
    },

    _locationError({ message, code }) {
      console.error(arguments[0]);
      let actionText = "Stop GNSS";
      let onAction = () => (this.settings.getLocation = false);

      switch (code) {
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

      this.lastKnowError = code;
      if (this.settings.inFlight)
        this.addLocation({ type: "LocationError", timestamp: Date.now() });

      this.openWarning(message, actionText, onAction);
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
        heading: heading + rand(10),
        speed: speed + rand(),
        timestamp: Date.now()
      };
    }
  }
};
