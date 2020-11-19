import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import Buefy from "buefy";
import "@mdi/font/css/materialdesignicons.css";
Vue.use(Buefy, {
  defaultProgrammaticPromise: true
});

import PouchDB from "pouchdb-browser";
// import PouchFind from "pouchdb-find";
// PouchDB.plugin(PouchFind);
// import PouchLiveFind from "pouchdb-live-find";
// PouchDB.plugin(PouchLiveFind);
import PouchAuthentication from "pouchdb-authentication";
PouchDB.plugin(PouchAuthentication);

import VuePouchdbLite from "vue-pouchdb-lite";
Vue.use(VuePouchdbLite, "navue");

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
