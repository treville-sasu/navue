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
    path: "/aircraft",
    name: "Aircraft",
    component: () => import("../views/Aircraft.vue")
  },
  {
    path: "/brief",
    name: "Briefing",
    component: () => import("../views/Briefing.vue")
  },
  {
    path: "/fly",
    name: "Fly",
    component: () => import("../views/Fly.vue")
  },
  {
    path: "/debrief",
    name: "Debriefing",
    component: () => import("../views/Wip.vue")
  },
  {
    path: "/monitor",
    name: "Monitor",
    component: () => import("../views/Wip.vue")
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
