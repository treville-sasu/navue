export const UserAccount = {
  // With couchDB 3.x only an admin can create users. disable this with :
  // https://github.com/apache/couchdb-documentation/issues/513
  //
  // PUT http://127.0.0.1:5984/_node/couchdb@127.0.0.1/_config/couchdb/users_db_security_editable true
  // PUT http://127.0.0.1:5984/_users/_security {"members":{"roles":[]},"admins":{"roles":["_admin"]}}
  // PUT http://127.0.0.1:5984/_node/couchdb@127.0.0.1/_config/couchdb/users_db_security_editable false
  data() {
    return {
      syncHandle: null,
      remoteDbUrl: new URL(process.env.VUE_APP_COUCHDB_URL)
    };
  },
  computed: {
    remoteDB() {
      return this.$pouch.getDB(this.remoteDbUrl);
    }
  },
  methods: {
    getCurrentUser() {
      return this.remoteDB
        .getSession()
        .then(res => {
          return new Promise((resolve, reject) => {
            res.userCtx.name
              ? resolve(res.userCtx.name)
              : reject(new Error("No session available."));
          });
        })
        .then(name => {
          return this.remoteDB.getUser(name);
        });
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
    // TODO: make a design document of it.
    getUserStats(userDB) {
      return userDB
        .query(
          {
            map: (doc, emit) => {
              emit(doc.type);
            },
            reduce: "_count" // _stats _count _sum _approx_count_distinct
          },
          {
            group: true
          }
        )
        .then(res => {
          return res.rows.reduce((acc, row) => {
            acc[row.key] = row.value;
            return acc;
          }, {});
        })
        .catch(console.error);
    },
    stopSync() {
      if (this.syncHandle) return this.syncHandle.cancel();
    },
    confirmAction(content) {
      return this.$buefy.dialog.confirm({
        type: "is-danger",
        hasIcon: true,
        ...content
      });
    },
    openToast(e) {
      this.$buefy.toast.open({
        duration: 2000,
        position: "is-top",
        type: "is-danger",
        ...e
      });
    }
  }
};
