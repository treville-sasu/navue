export const TraceHandler = {
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
        .on("change", ({ doc: { latitude, longitude } }) => {
          if (latitude && longitude)
            this.trace[0].unshift([latitude, longitude]);
          else this.trace.unshift([]);
        });
    },
    getTrace(db) {
      return db
        .query(
          {
            map: (doc, emit) => {
              if (doc.latitude && doc.longitude)
                emit(doc._id.split("-")[0], [doc.latitude, doc.longitude]);
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
