import Vue from "vue";
import Vuex from "vuex";

import { PouchVueModule as PouchModule } from "./modules/pouchvue";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedAircraft: null,
    aircrafts: []
  },
  mutations: {
    selectAircraft: (state, pl) => (state.selectedAircraft = pl),
    setAircraftsList: (state, pl) => (state.aircrafts = pl),
    updateAircraftReference: (state, pl) => {
      if (pl._id == state.selectedAircraft._id) state.selectedAircraft = pl;
      state.aircrafts.findIndex(a => a._id == pl._id);
    }
  },
  getters: {
    searchAircraft: state => string => {
      return state.aircrafts.filter(option => {
        return (
          option.registration
            .toString()
            .toLowerCase()
            .indexOf(string.toLowerCase()) >= 0
        );
      });
    }
  },
  modules: {
    pouch: PouchModule
  }
});
