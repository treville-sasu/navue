import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import 'leaflet/dist/leaflet.css';

import Buefy from "buefy";
Vue.use(Buefy);
import "leaflet-minimap/dist/Control.MiniMap.min.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
