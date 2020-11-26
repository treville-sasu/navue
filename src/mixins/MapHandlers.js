import L from "leaflet";
import LatLon from "geodesy/latlon-spherical.js";

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
      this._checkAccuracy(e)
        .then(this._checkDistance)
        .catch(this._locationError)
        .then(this._computeFromLastLocation)
        .then(this._checkAltitude)
        .then(this._checkSpeed)
        .then(e => {
          const {
            sourceTarget, // eslint-disable-line no-unused-vars
            target, // eslint-disable-line no-unused-vars
            bounds, // eslint-disable-line no-unused-vars
            latitude, // eslint-disable-line no-unused-vars
            longitude, // eslint-disable-line no-unused-vars
            ...rest
          } = e;
          this.lastKnownLocation = rest;

          if (this.settings.setView) this.bestView(e);

          return new Promise(resolve => {
            if (this.settings.inFlight) resolve(rest);
          });
        })
        .then(e => {
          this.setNextDestination;
          return e;
        })
        .then(this.addLocation);
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
    _checkAccuracy(e) {
      return new Promise((resolve, reject) => {
        e.accuracy < this.maxAccuracy
          ? resolve(e)
          : reject({
              ...e,
              type: "locationerror",
              message: `Geolocation error: low accuracy (${e.accuracy}m)`
            });
      });
    },
    _checkDistance(e) {
      return new Promise((resolve, reject) => {
        this.lastKnownLocation &&
        e.latlng.distanceTo(this.lastKnownLocation.latlng) < this.minDistance
          ? reject({
              ...e,
              type: "locationerror",
              message: `Geolocation error: still fixing.`
            })
          : resolve(e);
      });
    },
    _checkAltitude(e) {
      return new Promise(resolve => {
        e.altitudeAccuracy < this.maxAccuracy
          ? resolve(e)
          : resolve({
              ...e,
              altitude: undefined,
              altitudeAccuracy: undefined
              // type: "locationerror",
              // message: `Geolocation error: low altitude accuracy (${e.altitudeAccuracy}m)`
            });
      });
    },
    _checkSpeed(e) {
      return new Promise(resolve => {
        e.speed > this.minSpeed
          ? resolve(e)
          : resolve({
              ...e,
              speed: undefined,
              heading: undefined
              // type: "locationerror",
              // message: `Geolocation error: low velocity (${e.speed}m/s)`
            });
      });
    },
    _fakeLocation(
      { latlng = { lat: 0, lng: 0 }, accuracy = 20, altitude = 1000 },
      spread = 5
    ) {
      let rand = (s = spread) => {
        return (Math.random() - 0.5) * s;
      };

      return {
        type: "locationfaked",
        latlng: L.latLng(
          latlng.lat + rand(spread / 100),
          latlng.lng + rand(spread / 100)
        ),
        accuracy: accuracy + rand((accuracy * spread) / 100),
        altitude: altitude + rand((altitude * spread) / 100),
        altitudeAccuracy: accuracy + rand((accuracy * spread) / 100),
        timestamp: Date.now()
      };
    },
    _computeFromLastLocation(e) {
      if (this.lastKnownLocation) {
        let previous = new LatLon(
          this.lastKnownLocation.latlng.lat,
          this.lastKnownLocation.latlng.lng
        );
        let current = new LatLon(e.latlng.lat, e.latlng.lng);

        return {
          heading: previous.rhumbBearingTo(current),
          speed:
            (previous.rhumbDistanceTo(current) /
              (e.timestamp - this.lastKnownLocation.timestamp)) *
            1000,
          vario:
            ((this.lastKnownLocation.altitude - e.altitude) /
              (e.timestamp - this.lastKnownLocation.timestamp)) *
            1000,
          ...e
        };
      } else return e;
    }
  }
};
