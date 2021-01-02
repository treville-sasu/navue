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

if (process.env.NODE_ENV == "development") {
  // eslint-disable-next-line no-inner-declarations
  function proxyUrl(res) {
    if (res instanceof Request)
      return new Request(process.env.VUE_APP_PROXY + res.url, res);
    else if (res instanceof URL) return process.env.VUE_APP_PROXY + res.href;
    else
      return (
        process.env.VUE_APP_PROXY +
        res.replace("https://notamweb", "http://notamweb")
      );
  }
  var genuine_fetch = fetch;
  // eslint-disable-next-line no-global-assign
  fetch = function(resource, init = null) {
    return genuine_fetch(proxyUrl(resource), init);
  };
}
