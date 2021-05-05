import Vue from "vue";
import VueRouter from "vue-router";

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
    path: "/route/:id?",
    name: "Route",
    component: () => import("../views/Route.vue")
  },
  {
    path: "/moving-map/:id?",
    name: "MovingMap",
    component: () => import("../views/MovingMap.vue")
  },
  {
    path: "/replay",
    name: "Replay",
    component: () => import("../views/Wip.vue")
  },
  {
    path: "/radar/:id?",
    name: "Radar",
    component: () => import("../views/Wip.vue")
  },
  {
    path: "/route/:id?",
    name: "Route",
    component: () => import("../views/Route.vue")
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
