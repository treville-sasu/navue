import Vue from "vue";

import PouchDB from "pouchdb-browser";

import PouchFind from "pouchdb-find";
PouchDB.plugin(PouchFind);

import PouchLiveFind from "pouchdb-live-find";
PouchDB.plugin(PouchLiveFind);

// import PouchDebug from "pouchdb-debug";
// PouchDB.plugin(PouchDebug);

// import PouchAuthentication from "pouchdb-authentication"
// PouchDB.plugin(PouchAuthentication);

import PouchVue from "pouch-vue";

Vue.use(PouchVue, {
  pouch: PouchDB, // optional if `PouchDB` is available on the global object
  defaultDB: "navue", // this is used as a default connect/disconnect database
  optionDB: {}, // this is used to include a custom fetch() method (see TypeScript example)
  // debug: "pouchdb:find" // optional - See `https://pouchdb.com/api.html#debug_mode` for valid settings (will be a separate Plugin in PouchDB 7.0)
});

// const cloudant = {
//   url: "https://ec00bd97-69fa-4fdc-a34e-8cdbac77f580-bluemix.cloudantnosqldb.appdomain.cloud/",
//   api_key: "apikey-d24674c44426486bb086a4f5a60de2cc",
//   pass: "69fb6c1b517181a283bbc3ed17f04530a6066161"
// };

// this.vm.$pouch.sync("navue", cloudant.url);

export const PouchVueModule = {
  actions: {
    updateAircraft(ctx, aircraft) {
      let op = !aircraft._id ? this._vm.$pouch.post : this._vm.$pouch.put;
      op(aircraft)
        .then(res => {
          this.commit("selectAircraft", { ...aircraft, ...res });
        })
        .catch(console.debug);
    },
    getAircraft() { },
    deleteAircraft(ctx, aircraft) {
      this._vm.$pouch
        .remove(aircraft)
        .then(res => {
          if (this.state.selectedAircraft.id == res.id)
            this.commit("selectAircraft", null);
        })
        .catch(console.debug);
    }
  }
};
