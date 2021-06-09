import Vue from "vue";
import App from "./App.vue";
import wb from "./registerServiceWorker";
import router from "./router";
import store from "./store";

import Buefy from "buefy";
import "@mdi/font/css/materialdesignicons.css";
Vue.use(Buefy, {
  defaultProgrammaticPromise: true
});

import PouchDB from "pouchdb-browser";
import PouchAuthentication from "pouchdb-authentication";
PouchDB.plugin(PouchAuthentication);

import VuePouchdbLite from "vue-pouchdb-lite";
Vue.use(VuePouchdbLite, "navue");

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app").$sw = wb;

if (process.env.NODE_ENV == "development") {
  var genuine_fetch = fetch;
  // eslint-disable-next-line no-global-assign
  fetch = function(resource, init = null) {
    let target = resource instanceof Request ? resource.url : resource;
    // secure request is required to prevent Mixed-Content restriction. but real server protocol is http. as proxy is done here we remove the inapropriate protocol.
    target = target.replace("https://notamweb", "http://notamweb");
    const proxiedUrl = new URL(process.env.VUE_APP_PROXY);
    proxiedUrl.search = new URLSearchParams({ cors: target });
    return genuine_fetch(proxiedUrl, init);
  };
}
