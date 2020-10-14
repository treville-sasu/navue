import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentAircraft: null
  },
  mutations: {
    currentAircraft: (state, payload) => (state.currentAircraft = payload),
  }
});
