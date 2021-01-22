import { Location } from "@/models/Waypoint.js";
import { UIHelpers } from "@/mixins/apputils";

export const MapHandlers = {
  data() {
    return {
      maxAccuracy: 150,
      minSpeed: 1000 / 3600,
      minDistance: 1,
      geoOptions: {
        watch: true,
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      }
    };
  },
  mixins: [UIHelpers],
  methods: {
    stopLocate() {
      this.map.stopLocate();
      this.lastKnownLocation = undefined;
    },
    startLocate() {
      this.map.locate(this.geoOptions);
    },
    _locationFound(e) {
      let location = Location.from(e);

      try {
        if (location.accuracy > this.maxAccuracy)
          throw {
            ...location,
            type: "locationerror",
            message: `Geolocation error: too low accuracy (${location.accuracy}m)`
          };
      } catch (err) {
        this._locationError(err);
        return;
      }

      // now we have a location, let's polish it & use it.
      if (
        this.lastKnownLocation instanceof Location &&
        location.distanceTo(this.lastKnownLocation) <= this.minDistance
      )
        return;

      if (this.lastKnownLocation instanceof Location)
        location.computeMovementFrom(this.lastKnownLocation);

      if (location.altitude.accuracy > this.maxAccuracy)
        location.altitude = undefined;

      if (location.speed < this.minSpeed) {
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

    _locationError(e) {
      if (process.env.NODE_ENV == "development") {
        const location = this._fakeLocation({
          ...e,
          ...this.lastKnownLocation,
          accuracy: 20
        });
        this._locationFound(location);
        console.error(e);
      } else {
        delete e.sourceTarget;
        delete e.target;
        this.lastKnownError = { ...e };

        this.openWarning(
          e.message,
          "Stop GNSS",
          () => (this.settings.getLocation = false)
        );
      }
    },

    _fakeLocation(
      { latitude = 0, longitude = 0, accuracy = 20, altitude = 1000 },
      spread = 5
    ) {
      console.debug("faking location");

      let rand = (s = spread) => {
        return (Math.random() - 0.5) * s;
      };

      return Location.from({
        latitude: latitude + rand(spread / 100),
        longitude: longitude + rand(spread / 100),
        accuracy: accuracy + rand((accuracy * spread) / 100),
        altitude: altitude + rand((altitude * spread) / 100),
        altitudeAccuracy: accuracy + rand((accuracy * spread) / 100),
        timestamp: Date.now()
      });
    }
  }
};
