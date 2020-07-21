import Vue from "vue";
import VueRouter from "vue-router";
import Balance from "../views/Balance.vue";
import Checklists from "../views/Checklists.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/aircraft",
    name: "Aircraft",
    component: () => import("../views/Aircraft.vue")
  },
  {
    path: "/moving-map",
    name: "MovingMap",
    component: () => import("../views/MovingMap.vue")
  },
  {
    path: "/route",
    name: "Route",
    component: () => import("../views/Route.vue")
  },
  {
    path: "/weather",
    name: "Weather",
    component: () => import("../views/Weather.vue")
  },
  {
    path: "/approach",
    name: "approach",
    component: () => import("../views/ApproachChart.vue")
  },
  {
    path: "/balance",
    name: "Balance",
    component: Balance
  },
  {
    path: "/checklists",
    name: "Checklists",
    component: Checklists
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue")
  }
];

const router = new VueRouter({
  routes,
  linkActiveClass: "is-active"
});

export default router;
