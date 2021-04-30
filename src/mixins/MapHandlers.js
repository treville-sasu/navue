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

      try {
        if (location.accuracy > this.settings.maxAccuracy)
          throw {
            ...location,
            type: "locationerror",
            message: `Geolocation error: too low accuracy (${location.accuracy}m)`
          };
      } catch (err) {
        this._locationError(err);
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

      this.lastKnownLocation = location;

      if (this.settings.setView) this.bestView(location);

      if (this.settings.inFlight) {
        this.addLocation(location);

        const nextDestination = this.getDestination(location);
        if (nextDestination) this.setDestination(nextDestination);
      }
    },

    _locationError({ message }) {
      this.openWarning(
        message,
        "Stop GNSS",
        () => (this.settings.getLocation = false)
      );
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
