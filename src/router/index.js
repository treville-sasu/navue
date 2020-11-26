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
    path: "/aircraft/:id?",
    name: "Aircraft",
    component: () => import("../views/Aircraft.vue")
  },
  {
    path: "/moving-map/:id?",
    name: "MovingMap",
    component: () => import("../views/MovingMap.vue")
  },
  {
    path: "/route/:id?",
    name: "Route",
    component: () => import("../views/Route.vue")
  },
  {
    path: "/weather",
    name: "Weather",
    component: () => import("../views/Weather.vue")
  },
  {
    path: "/notam",
    name: "Notam",
    component: () => import("../views/Notam.vue")
  },
  {
    path: "/approach",
    name: "approach",
    component: () => import("../views/ApproachChart.vue")
  },
  {
    path: "/balance/:id?",
    name: "Balance",
    component: Balance
  },
  {
    path: "/checklists/:id?",
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
  mode: "history",
  routes,
  linkActiveClass: "is-active",
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash
        // , offset: { x: 0, y: 10 }
      };
    }
  }
});

export default router;
