import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    aircrafts: [require("./F-GCIU.json"), require("./F-BVDD.json")]
  },
  mutations: {},
  actions: {},
  modules: {}
});