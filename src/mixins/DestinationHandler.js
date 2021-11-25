import { Waypoint } from "@/models/Waypoint.js";
import c from "@/assets/colors.scss";
import { featureCollection } from "@turf/helpers";

export default {
  data() {
    return {
      currentDestination: undefined,
      settings: {
        minDestination: 100,
        futurPositionDelay: 3
      },
      style: {
        destination: {
          point: {
            type: "symbol",
            filter: ["==", ["geometry-type"], "Point"],
            layout: {
              "icon-anchor": "center",
              "text-anchor": "center",
              "text-justify": "center",
              "icon-image": "br-state-2",
              "text-field": ["get", "label"]
            }
          },
          path: {
            type: "line",
            filter: ["==", ["geometry-type"], "LineString"],
            layout: {
              "line-join": "round",
              "line-cap": "round"
            },
            paint: {
              "line-color": c["success"],
              "line-width": 6,
              "line-opacity": 0.7
            }
          },
          parameters: {
            type: "symbol",
            filter: ["==", ["geometry-type"], "LineString"],
            layout: {
              "symbol-placement": "line",
              "text-allow-overlap": true,
              "text-pitch-alignment": "viewport",
              "text-field": ["get", "label"],
              "text-size": 24
            },
            paint: {
              "text-color": "#FFFFFF",
              "text-halo-color": "#000000",
              "text-halo-width": 1.25
            }
          }
        }
      }
    };
  },
  computed: {
    flightVector() {
      let line,
        features = [];
      if (this.currentDestination) features.push(this.currentDestination);
      if (this.currentDestination && this.currentLocation) {
        line = this.currentLocation.greatCircleTo(this.currentDestination);
        line.properties.label = `${line.properties.bearing} - ${line.properties.distance}`;
        features.push(line);
      }
      return featureCollection(features);
    }
  },
  methods: {
    setDestination({ lngLat } = {}) {
      if (arguments[0] instanceof Waypoint)
        this.currentDestination = arguments[0];
      else
        this.currentDestination = Waypoint.fromEvent({
          lngLat
        });
    },
    getDestination(lastDestination) {
      //TODO : on route select, set a Next Destination
      if (
        this.destination &&
        lastDestination.distanceTo(this.destination) <
        this.settings.minDestination
      ) {
        this.currentDestination = this.navigation.getNextWaypoint(
          this.currentDestination
        );
      } else return;
    }
  }
};
