import { featureCollection } from "@turf/helpers";
import c from "@/assets/colors.scss";

export default {
  data() {
    return {
      style: {
        navigation: {
          path: {
            type: "line",
            filter: ["==", ["geometry-type"], "LineString"],
            layout: {
              "line-join": "round",
              "line-cap": "round"
            },
            paint: {
              "line-color": c["info"],
              "line-width": 6,
              "line-opacity": 0.7
            }
          },
          parameters: {
            type: "symbol",
            filter: ["==", ["geometry-type"], "LineString"],
            layout: {
              "symbol-placement": "line-center",
              "text-allow-overlap": true,
              "text-pitch-alignment": "viewport",
              "text-field": ['concat', ["get", "distance"], " | ", ["get", "bearing"]],
              "text-size": 24
            },
            paint: {
              "text-color": "#FFFFFF",
              "text-halo-color": "#000000",
              "text-halo-width": 1.25
            }
          },
          point: {
            type: "symbol",
            filter: ["==", ["geometry-type"], "Point"],
            layout: {
              "icon-anchor": "center",
              "text-anchor": "center",
              "text-justify": "center",
              "icon-image": "circle-white-2",
              "text-field": ["get", "name"],
            }
          },
        }
      }
    };
  },
  computed: {
    navigationTrace() {
      if (this.navigation) {
        let features = [...this.navigation.toGeoJSON("MultiLineString").features];
        this.navigation.forEach(b => features = [...features, ...b.features]);
        return featureCollection(features);
      }
    },
  },
  methods: {
  }
};
