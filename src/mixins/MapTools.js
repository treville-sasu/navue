import { Navigation } from "@/models/Navigation.js";

export const MapTools = {
  data() {
    return {
      tool: null,
      pointerVector: [null, null],
      currentRoute: null
    };
  },
  computed: {
    inactiveRoutes() {
      try {
        return this.navigation.routes.filter(rte => rte != this.currentRoute);
      } catch {
        return [];
      }
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
        mouseout: () => this.updatePointer(null),
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
    selectRoute(id) {
      this.currentRoute = this.navigation.routes[id];
    },
    addMarker(e) {
      this.navigation.addWaypoint(e, this.currentRoute);
    },
    removeMarker(id) {
      this.navigation.removeWaypoint(id, this.currentRoute);
      if (this.navigation.clearRoute(this.currentRoute))
        this.currentRoute = null;
    },
    updatePointer(e) {
      this.pointerVector.splice(1, 1, e ? e.latlng : null);
    }
  },
  watch: {
    tool(newTool, oldTool) {
      switch (oldTool) {
        case "route":
          this.map._container.style.cursor = null;
          if (this.navigation) this.navigation.clearRoute(this.currentRoute);
          break;
        default:
          this.map._container.style.cursor = null;
      }
      switch (newTool) {
        case "route":
          if (!this.navigation) this.navigation = new Navigation();
          if (!this.currentRoute)
            this.currentRoute = this.navigation.addRoute();
          this.map._container.style.cursor = "crosshair";
          break;
        case "select":
          this.isNavigationSelectActive = true;
          break;
        case "clear":
          if (this.navigation) this.navigation.removeRoute(this.currentRoute);
          this.currentRoute = null;
          this.$nextTick(() => (this.tool = null));
          break;
      }
    },
    currentRoute(newVal) {
      if (newVal && newVal.length > 0)
        this.pointerVector.splice(0, 1, newVal[newVal.length - 1].latlng);
      else this.pointerVector.splice(0, 1, null);

      if (!newVal) this.tool = null;
    }
  }
};
