import Vue from "vue";
import Vuex from "vuex";

import { Navigation } from "@/models/Navigation.js";
import { Aircraft } from "@/models/Aircraft.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    currentAircraft: null,
    currentNavigation: null
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
      state.currentAircraft = payload ? Aircraft.import(payload) : payload;
    },
    currentNavigation(state, payload) {
      state.currentNavigation = payload ? Navigation.import(payload) : payload;
    }
  },
  actions: {
    saveToDB(context, payload) {
      return this._vm.$pouch.put(payload);
    },
    deleteFromDB(context, payload) {
      return this._vm.$pouch.remove(payload);
    }
  }
});
