import L from "leaflet";
import GeometryUtils from "leaflet-geometryutil";

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
      e.heading = e.heading || GeometryUtils.bearing(last.latlng, e.latlng);
      e.speed =
        e.speed ||
        GeometryUtils.distance(this.map, last.latlng, e.latlng) /
        Math.floor((e.timestamp - last.timestamp) / 1000);
      e.vario =
        (last.altitude - e.altitude) /
        Math.floor((e.timestamp - last.timestamp) / 1000);
    },
    _debounceLocation(e, last) {
      if (e.accuracy > 100) {
        e.type = "locationerror";
        e.message = "Geolocation error: low accuracy.";
        return false;
      } else if (e.altitudeAccuracy > 15) {
        delete e.altitude;
        delete e.altitudeAccuracy;
        return true;
      } else if (
        last &&
        GeometryUtils.distance(this.map, last.latlng, e.latlng) <= 1
      )
        return false;
      else return true;
    },
    bestBounds(e) {
      let futur = GeometryUtils.destination(
        e.latlng,
        e.heading || 0,
        (e.speed || 0.3) * 5 * 60
      );
      return L.latLngBounds(
        futur,
        GeometryUtils.rotatePoint(this.map, futur, 180, e.latlng)
      );
    },
    _fakeLocation(
      center = { lat: 0, lng: 0 },
      accuracy = 20,
      altitude = 1000,
      spread = 5
    ) {
      let rand = (s = spread) => {
        return (Math.random() - 0.5) * s;
      };

      return {
        type: "fakelocation",
        latlng: {
          lat: center.lat + rand(),
          lng: center.lng + rand()
        },
        accuracy: accuracy + rand(accuracy * spread / 100),
        altitude: altitude + rand(altitude * spread / 100),
        altitudeAccuracy: accuracy + rand(accuracy * spread / 100),
        timestamp: Date.now()
      };
    }
  }
};
