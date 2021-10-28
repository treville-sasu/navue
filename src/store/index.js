import Vue from "vue";
import Vuex from "vuex";

import { Navigation } from "@/models/Navigation.js";
import { Aircraft } from "@/models/Aircraft.js";
import { Location } from "@/models/Location.js";
import { Flight } from "@/models/Flight.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: undefined,
    currentAircraft: undefined,
    currentNavigation: undefined,
    currentLocation: undefined,
    currentFlight: undefined,
    currentQueries: {}
  },
  getters: {
    pois(state) {
      return (state.currentNavigation && state.currentNavigation.poi) || [];
    }
  },
  mutations: {
    currentUser(
      state,
      // eslint-disable-next-line no-unused-vars
      { derived_key, iterations, password_scheme, salt, ...user } = {}
    ) {
      state.currentUser = Object.keys(user).length == 0 ? undefined : user;
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
    },
    currentQueries(state, query) {
      state.currentQueries = { ...state.currentQueries, ...query };
    },
    cleanStore(state) {
      state.currentUser = undefined;
      state.currentAircraft = undefined;
      state.currentNavigation = undefined;
      state.currentFlight = undefined;
      state.currentLocation = undefined;
      state.currentQueries = {};
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
