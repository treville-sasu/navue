import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import Buefy from "buefy";
import "@mdi/font/css/materialdesignicons.css";
Vue.use(Buefy);

import PouchDB from "pouchdb-browser";
import PouchFind from "pouchdb-find";
import PouchLiveFind from "pouchdb-live-find";
import PouchAuthentication from "pouchdb-authentication";
PouchDB.plugin(PouchFind);
PouchDB.plugin(PouchLiveFind);
PouchDB.plugin(PouchAuthentication);

import PouchVue from "pouch-vue";

Vue.use(PouchVue, {
  pouch: PouchDB,
  defaultDB: "navue"
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
