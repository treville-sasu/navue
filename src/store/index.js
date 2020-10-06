import Vue from "vue";
import Vuex from "vuex";

import { PouchVueModule as PouchModule } from "./modules/pouchvue";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedAircraft: null
  },
  mutations: {
    selectAircraft: (state, pl) => (state.selectedAircraft = pl)
  },
  modules: {
    pouch: PouchModule
  }
});
