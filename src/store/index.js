import Vue from "vue";
import Vuex from "vuex";

import { Navigation } from "@/models/Navigation.js";
import { Aircraft } from "@/models/Aircraft.js";
import { Location } from "@/models/Waypoint.js";
import { Flight } from "@/models/Flight.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    currentAircraft: null,
    currentNavigation: null,
    currentLocation: null,
    currentFlight: null
  },
  mutations: {
    currentUser: (state, payload) => {
      /* eslint-disable no-unused-vars */
      if (payload) {
        let {
          derived_key,
          iterations,
          password_scheme,
          salt,
          ...rest
        } = payload;
        /* eslint-enable no-unused-vars */
        state.currentUser = rest;
      } else state.currentUser = null;
    },
    currentAircraft(state, payload) {
      state.currentAircraft = payload ? Aircraft.from(payload) : payload;
    },
    currentNavigation(state, payload) {
      state.currentNavigation = payload ? Navigation.from(payload) : payload;
    },
    currentFlight(state, payload) {
      state.currentFlight = payload ? Flight.from(payload) : payload;
    },
    currentLocation(state, payload) {
      state.currentLocation = payload ? Location.from(payload) : payload;
    }
  },
  actions: {
    async saveToDB(context, payload) {
      let asJSON = JSON.parse(JSON.stringify(payload));
      asJSON._id || (asJSON._id = `${asJSON.type}-${Date.now()}`);
      let { id } = await this._vm.$pouch.put(asJSON);
      return await this._vm.$pouch.get(id, { include_docs: true });
    },
    deleteFromDB(context, payload) {
      return this._vm.$pouch.remove(payload);
    }
  }
});
