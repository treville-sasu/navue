import { Location } from "@/models/Navigation.js";

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
  methods: {
    stopLocate() {
      this.map.stopLocate();
    },
    startLocate() {
      this.map.locate(this.geoOptions);
    },
    _locationFound(e) {
      let location = Location.import(e);

      try {
        if (location.accuracy > this.maxAccuracy)
          throw {
            type: "locationerror",
            message: `Geolocation error: too low accuracy (${location.accuracy}m)`
          };

        if (
          this.lastKnownLocation instanceof Location &&
          location.distanceTo(this.lastKnownLocation) <= this.minDistance
        )
          throw {
            type: "locationerror",
            message: `Geolocation error: still fixing.`
          };
      } catch (err) {
        this._locationError(err);
      }

      if (this.lastKnownLocation instanceof Location)
        location.lastLocation = this.lastKnownLocation;

      if (location.altitude.accuracy > this.maxAccuracy) location.altitude = {};

      if (location.speed < this.minSpeed) {
        location.speed = undefined;
        location.heading = undefined;
      }

      this.lastKnownLocation = location;
      if (this.settings.setView) this.bestView(location);
      if (this.settings.inFlight) {
        this.addLocation(location);
        this.setDestination(this.getDestination(location));
      }
    },
    _locationError(e) {
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV == "development") {
          resolve(this._fakeLocation({ ...e, accuracy: 20 }));
        } else {
          delete e.sourceTarget;
          delete e.target;
          this.lastKnownError = { ...e };

          if (this.settings.allowWarning) this.openWarning(e);
          reject({
            ...e
          });
        }
      });
    },
    _fakeLocation(
      { latlng = { lat: 0, lng: 0 }, accuracy = 20, altitude = 1000 },
      spread = 5
    ) {
      let rand = (s = spread) => {
        return (Math.random() - 0.5) * s;
      };

      return Location.import({
        type: "locationfaked",
        latitude: latlng.lat + rand(spread / 100),
        longitude: latlng.lng + rand(spread / 100),
        accuracy: accuracy + rand((accuracy * spread) / 100),
        altitude: altitude + rand((altitude * spread) / 100),
        altitudeAccuracy: accuracy + rand((accuracy * spread) / 100),
        timestamp: Date.now()
      });
    }
  }
};
