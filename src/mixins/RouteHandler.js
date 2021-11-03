import { Navigation } from "@/models/Navigation.js";
import { Waypoint } from "../models/Waypoint";

export const RouteHandler = {
  data() {
    return {
      map: undefined,
      tool: null,
      pointerPosition: null,
      currentRoute: null
    };
  },
  provide: function() {
    return {
      getMap: this.getMap
    };
  },
  computed: {
    inactiveRoutes() {
      return this.navigation
        ? this.navigation.branches.filter(rte => rte != this.currentRoute)
        : [];
    },
    pointerVector() {
      return [
        this.currentRoute && this.currentRoute.last()
          ? this.currentRoute.last().lngLat
          : null,
        this.pointerPosition ? this.pointerPosition.latlng : null
      ];
    },
    mapEvents() {
      return [
        "ready",
        "click",
        "dblclick",
        "contextmenu",
        "mousemove",
        "mouseout"
      ].reduce(
        (o, type) => ({
          ...o,
          [type]: e => {
            if (this.mapEventsHandlers[e.type])
              this.mapEventsHandlers[e.type](e);
            else if (e.type == null) this.mapEventsHandlers["ready"](e);
          }
        }),
        {}
      );
    },
    mapEventsHandlers() {
      let defaultEvents = {
        ready: this.setupMap,
        contextmenu: () => this.selectRoute(null)
      };
      let pointerEvents = {
        mouseout: this.updatePointer,
        mousemove: this.updatePointer
      };
      switch (this.tool) {
        case "route":
          return {
            click: this.addMarker,
            ...pointerEvents,
            ...defaultEvents
          };
        case "bearing":
          return {
            click: this.addBearing,
            ...pointerEvents,
            ...defaultEvents
          };
        default:
          return defaultEvents;
      }
    }
  },
  methods: {
    setupMap(e) {
      this.map = e;
    },
    getMap() {
      return this.map;
    },
    selectRoute(id) {
      this.currentRoute = this.inactiveRoutes[id];
    },
    addMarker({ latlng: { lng, lat }, insertBefore } = {}) {
      this.currentRoute.insert(new Waypoint([lng, lat]), insertBefore);
      return false;
    },
    removeMarker(id) {
      this.currentRoute = this.navigation.removeWaypoint(this.currentRoute, id);
    },
    updatePointer({ latlng, type } = {}) {
      this.pointerPosition = { latlng, type };
    }
  },
  watch: {
    tool(newTool, oldTool) {
      switch (oldTool) {
        case "route":
          this.map._container.style.cursor = null;
          break;
        default:
          this.map._container.style.cursor = null;
      }
      switch (newTool) {
        case "route":
          if (!this.navigation) this.navigation = new Navigation();
          if (!this.currentRoute)
            this.currentRoute = this.navigation.addBranch().last();
          this.map._container.style.cursor = "crosshair";
          break;
        case "select":
          this.isNavigationManagerActive = true;
          break;
        case "clear":
          if (this.currentRoute)
            this.navigation.removeBranch(this.currentRoute);
          this.currentRoute = null;
          this.$nextTick(() => (this.tool = null));
          break;
      }
    },
    currentRoute(route) {
      this.tool = !route ? null : "route";
    }
  }
};
