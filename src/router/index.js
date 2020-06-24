import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Aircraft from "../views/Aircraft.vue";
import Route from "../views/Route.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/aircraft",
    name: "Aircraft",
    component: Aircraft
  },
  {
    path: "/route",
    name: "Route",
    component: Route
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
