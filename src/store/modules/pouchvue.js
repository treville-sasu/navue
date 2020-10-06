import Vue from "vue";

import PouchDB from "pouchdb-browser";
import PouchFind from "pouchdb-find";
import PouchLiveFind from "pouchdb-live-find";
import PouchAuthentication from "pouchdb-authentication";
PouchDB.plugin(PouchFind);
PouchDB.plugin(PouchLiveFind);
PouchDB.plugin(PouchAuthentication);

import PouchVue from "pouch-vue";

Vue.use(PouchVue, {
  pouch: PouchDB, // optional if `PouchDB` is available on the global object
  defaultDB: "navue",
  optionDB: {} // this is used to include a custom fetch() method (see TypeScript example)
});

export const PouchVueModule = {
  state: {
    alwaysdata: {
      url: "https://couchdb-treville.alwaysdata.net",
      username: "treville_navue",
      passord: "navue-vuena",
      db: "treville_navue"
    },
    cloudant: {
      apikey: "6zWjuVXBjqTI1aJTeoN0wDLi5NjYXL9hKmWeazZeAvBB",
      host:
        "ec00bd97-69fa-4fdc-a34e-8cdbac77f580-bluemix.cloudantnosqldb.appdomain.cloud",
      iam_apikey_description:
        "Auto-generated for key 26a30344-b10e-4030-b29a-8fa5be3e1a78",
      iam_apikey_name: "Service credentials-1",
      iam_role_crn: "crn:v1:bluemix:public:iam::::serviceRole:Manager",
      iam_serviceid_crn:
        "crn:v1:bluemix:public:iam-identity::a/0a6713d47ed7424ea3bbb129cbba0ff9::serviceid:ServiceId-44afac23-1be5-44ee-b66d-853bc9e874dd",
      password:
        "117b616e29e29805551f57febb506212c925297cebd3a458c19e0b0aea03a853",
      port: 443,
      url:
        "https://ec00bd97-69fa-4fdc-a34e-8cdbac77f580-bluemix:117b616e29e29805551f57febb506212c925297cebd3a458c19e0b0aea03a853@ec00bd97-69fa-4fdc-a34e-8cdbac77f580-bluemix.cloudantnosqldb.appdomain.cloud",
      username: "ec00bd97-69fa-4fdc-a34e-8cdbac77f580-bluemix",
      db: "navue-dev"
    },
    localDB: "navue"
  },
  actions: {
    updateAircraft(ctx, aircraft) {
      let op = !aircraft._id ? this._vm.$pouch.post : this._vm.$pouch.put;
      op({ ...aircraft, type: "aircraft" })
        .then(res => {
          this.commit("selectAircraft", { ...aircraft, ...res });
        })
        .catch(console.debug);
    },
    deleteAircraft(ctx, aircraft) {
      this._vm.$pouch
        .remove(aircraft)
        .then(res => {
          if (this.state.selectedAircraft.id == res.id)
            this.commit("selectAircraft", null);
        })
        .catch(console.debug);
    },
    updateDB(ctx, doc) {
      (!doc._id ? this._vm.$pouch.post : this._vm.$pouch.put)(doc)
        .then(res => {
          if (res.type == "aircraft")
            this.commit("selectAircraft", { ...doc, ...res });
        })
        .catch(console.debug);
    },
    deleteDB(ctx, doc) {
      this._vm.$pouch
        .remove(doc)
        .then(res => {
          if (this.state.selectedAircraft.registration == res.registration)
            this.commit("selectAircraft", null);
        })
        .catch(console.debug);
    },
    syncDB(ctx) {
      this._vm.$pouch.sync(ctx.state.localDB, ctx.getters.RemoteURL);
    }
  },
  getters: {
    RemoteURL: state =>
      new URL(state.cloudant.db, state.cloudant.url).toString()
    // RemoteURL: state => {
    //   let db = new URL(state.alwaysdata.db, state.alwaysdata.url);
    //   db.username = state.alwaysdata.username;
    //   db.password = state.alwaysdata.password;
    //   db.toString();
    // }
  }
};
