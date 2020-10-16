import L from "leaflet";
import LatLon from "geodesy/latlon-spherical.js";

export const MapHandlers = {
  methods: {
    stopLocate() {
      this.map.stopLocate();
    },
    startLocate() {
      this.map.locate({
        watch: true,
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    },
    _computeFromLastLocation(e, last) {
      let previous = new LatLon(last.latlng.lat, last.latlng.lng);
      let current = new LatLon(e.latlng.lat, e.latlng.lng);
      e.heading = e.heading || previous.rhumbBearingTo(current);
      e.speed =
        e.speed ||
        previous.rhumbDistanceTo(current) /
        Math.floor((e.timestamp - last.timestamp) / 1000);
      e.vario =
        (last.altitude - e.altitude) /
        Math.floor((e.timestamp - last.timestamp) / 1000);
    },
    _debounceLocation(e, last) {
      if (e.accuracy > 100) {
        e.type = "locationerror";
        e.message = `Geolocation error: low accuracy. ${e.accuracy}m`;
        return false;
      } else if (e.altitudeAccuracy > 15) {
        delete e.altitude;
        delete e.altitudeAccuracy;
        return true;
      } else if (
        last &&
        new LatLon(last.latlng.lat, last.latlng.lng).rhumbDistanceTo(
          new LatLon(e.latlng.lat, e.latlng.lng)
        ) <= 1
      )
        return false;
      else return true;
    },
    _fakeLocation(
      { latlng = { lat: 0, lng: 0 }, accuracy = 20, altitude = 1000 },
      spread = 5
    ) {
      let rand = (s = spread) => {
        return (Math.random() - 0.5) * s;
      };

      return {
        type: "fakelocation",
        latlng: L.latLng(latlng.lat + rand(), latlng.lng + rand()),
        accuracy: accuracy + rand((accuracy * spread) / 100),
        altitude: altitude + rand((altitude * spread) / 100),
        altitudeAccuracy: accuracy + rand((accuracy * spread) / 100),
        timestamp: Date.now()
      };
    }
  }
};
