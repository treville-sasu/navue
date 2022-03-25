export default {
  data() {
    return {
      traceDB: "navue_trace",
      traceType: "Location",
      trace: [],
      settings: {
        traceLength: 250
      }
    };
  },
  async created() {
    this.setTrace(this.$pouch.getDB(this.traceDB));
  },
  beforeDestroy() {
    this.traceFeed.cancel();
  },
  methods: {
    async setTrace(db) {
      this.trace = await this.getTrace(db);

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
            if (this.trace[0] && coordinates)
              //FIXME:  To be removed when using vue-mapx
              this.trace[0].unshift([
                coordinates[1],
                coordinates[0],
                coordinates[2]
              ]);
            // reverse is for Mapbox vs leaflet coordinates order
            // this.trace[0].unshift(coordinates);
            else this.trace.unshift([]);
          }
        );
    },
    getTrace(db) {
      return db
        .query(
          {
            map: ({ _id, geometry: { coordinates } }, emit) => {
              //FIXME:  To be removed when using vue-mapx
              if (coordinates)
                emit(_id.split("-")[0], [
                  coordinates[1],
                  coordinates[0],
                  coordinates[2]
                ]);
              // reverse is for Mapbox vs leaflet coordinates order
              // if (coordinates) emit(_id.split("-")[0], coordinates);
            },
            reduce: (keys, values) => {
              return values;
            }
          },
          { group: true, limit: this.traceLength }
        )
        .then(({ rows }) => {
          return rows.reduce((acc, row) => {
            acc.unshift(row.value);
            return acc;
          }, []);
        });
    }
  }
};
