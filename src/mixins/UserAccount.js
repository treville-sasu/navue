export const UserAccount = {
  data() {
    return {
      syncHandle: null,
      remoteDbUrl: new URL(process.env.VUE_APP_COUCHDB_URL)
    };
  },
  async created() {
    let _rev, views, isNew;

    let userDesign = {
      _id: "_design/user",
      views: {
        /* eslint-disable no-undef */
        "count-items": {
          map: function({ type }) {
            emit(type);
          }.toString(),
          reduce: "_count"
        },
        stats: {
          map: function({ type, length, duration }) {
            switch (type) {
              // case "Aircraft": emit(type, length);
              case "Navigation":
                emit("NavigationDistance", length || 0);
                break;
              case "Flight":
                emit("FlightTime", duration || 0);
                break;
              default:
                emit(type);
            }
          }.toString(),
          reduce: "_sum"
        }
        /* eslint-enable no-undef */
      }
      // validate_doc_update: function(newDoc, oldDoc, userCtx) {
      //   throw { forbidden: "not able now!" };
      // }.toString()
    };

    try {
      ({ _rev, views } = await this.$pouch.get(userDesign._id));
    } catch {
      isNew = true;
    } finally {
      // TODO this is a very poor assertion, objective is not to deploy a designdocument if it is not changed.
      if (isNew || JSON.stringify(views) != JSON.stringify(userDesign.views))
        await this.$pouch.put({ _rev, ...userDesign });
    }
  },
  computed: {
    currentUser: {
      get() {
        return this.$store.state.currentUser;
      },
      set(val) {
        this.$store.commit("currentUser", val);
      }
    },
    remoteDB() {
      return this.$pouch.getDB(this.remoteDbUrl);
    }
  },
  methods: {
    async setCurrentUser() {
      try {
        const {
          userCtx: { name }
        } = await this.remoteDB.getSession();
        if (name) {
          this.currentUser = await this.remoteDB.getUser(name);
          return this.$pouch.getDB(
            new URL(this.userDBname(this.currentUser.name), this.remoteDbUrl)
          );
        } else new Error("No session available.");
      } catch (e) {
        console.error(e);
      }
    },
    userDBname(name) {
      return (
        "userdb-" +
        Array.from(name)
          .map(c =>
            c.charCodeAt(0) < 128
              ? c.charCodeAt(0).toString(16)
              : encodeURIComponent(c)
                  .replace(/%/g, "")
                  .toLowerCase()
          )
          .join("")
      );
    },
    getUserStats(userDB) {
      return Promise.allSettled([
        userDB
          .query("user/count-items", {
            group: true
          })
          .then(({ rows }) => {
            return rows.reduce((acc, row) => {
              acc[row.key] = row.value;
              return acc;
            }, {});
          }),
        //  userDB
        //     .query("user/stats", {
        //       group: true
        //     }),
        navigator.storage.estimate().then(({ usage, quota }) => {
          return { storage: usage / quota };
        })
      ])
        .then(results => {
          return results.reduce((acc, { status, value }) => {
            if (status == "fulfilled") acc = { ...acc, ...value };
            return acc;
          }, {});
        })
        .catch(console.error);
    },
    startSync(userDB, handler) {
      this.stopSync();
      this.syncHandle = this.$pouch.sync(userDB, {
        // filter: function(doc) {
        //   return !!doc._id.indexOf("_design");
        // }
      });
      if (handler)
        this.syncHandle
          .on("active", e => handler("active", e))
          .on("change", e => handler("change", e))
          .on("paused", e => handler("paused", e))
          .on("complete", e => handler("complete", e))
          .on("error", e => handler("error", e))
          .on("denied", e => handler("denied", e));

      if (process.env.NODE_ENV == "development")
        this.syncHandle
          .on("active", () => console.info("start Sync."))
          .on("complete", () => console.info("stop Sync."));
    },
    stopSync() {
      if (this.syncHandle) return this.syncHandle.cancel();
    },
    async cleanLocal() {
      await this.$pouch.viewCleanup();
      try {
        await this.$pouch.destroy();
      } finally {
        if (process.env.NODE_ENV == "development")
          console.info("browser cleaned.");
      }
    }
  }
};
