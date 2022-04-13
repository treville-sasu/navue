import { featureCollection } from "@turf/helpers";
import { Angle, Distance, Altitude } from "@/models/Quantities.js";
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
              "line-cap": "round",
            },
            paint: {
              "line-color": c["info"],
              "line-width": 6,
              "line-opacity": 0.7,
            },
          },
          parameters: {
            type: "symbol",
            filter: ["==", ["geometry-type"], "LineString"],
            layout: {
              "symbol-placement": "line-center",
              "text-allow-overlap": true,
              "text-pitch-alignment": "viewport",
              "text-field": ["get", "label"],
              "text-size": 24,
            },
            paint: {
              "text-color": "#FFFFFF",
              "text-halo-color": "#000000",
              "text-halo-width": 1.25,
            },
          },
          point: {
            type: "symbol",
            filter: ["==", ["geometry-type"], "Point"],
            layout: {
              "icon-image": "circle-white-2",
              "icon-anchor": "center",
              "text-anchor": "top",
              "text-justify": "center",
              //FIXME: position is shity for multiple labels.
              "text-offset": [0, -0.5],
              "text-field": ["get", "label"],
            },
          },
        },
      },
    };
  },
  computed: {
    navigationCourse() {
      if (this.navigation) {
        let features = [
          ...this.navigation.toGeoJSON("MultiLineString").features, //could be 'Geodesics'
        ];
        features.forEach((f) => {
          f.properties.label = `${new Angle(
            Angle.wrap360(f.properties.bearing),
            "°",
            {
              precision: 3,
            }
          )}  ${new Distance(f.properties.distance, "m", {
            precision: 3,
            unit: "NM",
          })}`;
        });

        this.navigation.forEach((b) => {
          b.features.forEach((f, i) => {
            f.properties.label = `${
              f.properties.name || String.fromCharCode(65 + (i % 26))
            }
            ${
              f.altitude
                ? new Altitude(f.altitude, "m", {
                    precision: 2,
                    unit: "ft",
                    reference: f.properties.altitudeReference || "MSL",
                  })
                : ""
            }
            `;
            return f;
          });

          features = [...features, ...b.features];
        });
        return featureCollection(features);
      }
    },
  },
  methods: {},
};
