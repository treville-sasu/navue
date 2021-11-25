import { multiLineString } from "@turf/helpers";
import c from "@/assets/colors.scss";

export default {
  data() {
    return {
      traceDB: "navue_trace",
      traceType: "Location",
      flightTrace: undefined,
      settings: {
        traceLength: 250
      },
      style: {
        trace: {
          path: {
            type: "line",
            filter: ["==", ["geometry-type"], "LineString"],
            layout: {
              "line-join": "round",
              "line-cap": "round"
            },
            paint: {
              "line-color": c["primaryLight"],
              "line-width": 6,
              "line-opacity": 0.7
            }
          },
        }
      }
    }
  },
  async created() {
    this.setTrace(this.$pouch.getDB(this.traceDB));
  },
  beforeDestroy() {
    this.traceFeed.cancel();
  },
  methods: {
    async setTrace(db) {
      this.flightTrace = await this.getTrace(db);

      this.traceFeed = db
        .on("destroyed", e => {
          if (e) {
            this.traceFeed.cancel();
            this.traceFeed = this.setTrace(this.$pouch.getDB(db.name));
          }
        })
        .changes({
          since: "now",
          live: true,
          include_docs: true
        })
        .on(
          "change",
          ({
            doc: {
              geometry: { coordinates }
            }
          }) => {
            if (this.flightTrace.geometry.coordinates[0] && coordinates)
              this.flightTrace.geometry.coordinates[0].unshift(coordinates);
            else this.flightTrace.geometry.coordinates.unshift([]);
          }
        );
    },
    getTrace(db) {
      return db
        .query(
          {
            map: ({ _id, geometry: { coordinates } }, emit) => {
              if (coordinates) emit(_id.split("-")[0], coordinates);
            },
            reduce: (keys, values) => {
              return values;
            }
          },
          { group: true, limit: this.traceLength }
        )
        .then(({ rows }) => {
          return multiLineString(
            rows.reduce((acc, row) => {
              acc.unshift(row.value);
              return acc;
            }, [])
          );
        });
    }
  }
};
