import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentAircraft: null,
    currentNavigation: null,
    aircraftSelect: null,
    navigationSelect: null
  },
  mutations: {
    currentAircraft: (state, payload) => (state.currentAircraft = payload),
    currentNavigation: (state, payload) => (state.currentNavigation = payload),
    aircraftSelect: (state, payload) => (state.aircraftSelect = payload),
    navigationSelect: (state, payload) => (state.navigationSelect = payload)
  }
});
