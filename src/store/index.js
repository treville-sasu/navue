import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    currentAircraft: null,
    currentNavigation: null,
    aircraftSelect: null,
    navigationSelect: null
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
    currentAircraft: (state, payload) => (state.currentAircraft = payload),
    currentNavigation: (state, payload) => (state.currentNavigation = payload),
    aircraftSelect: (state, payload) => (state.aircraftSelect = payload),
    navigationSelect: (state, payload) => (state.navigationSelect = payload)
  }
});
