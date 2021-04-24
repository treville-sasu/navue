import { Navigation } from "@/models/Navigation.js";

export const MapTools = {
  data() {
    return {
      tool: null,
      pointerPosition: null,
      currentRoute: null
    };
  },
  computed: {
    inactiveRoutes() {
      try {
        return this.navigation.routes.items.filter(
          rte => rte != this.currentRoute
        );
      } catch {
        return [];
      }
    },
    pointerVector() {
      return [
        this.currentRoute && this.currentRoute.last
          ? this.currentRoute.last.latlng
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
      this.map.locate({ setView: true, maxZoom: 10 });
    },
    selectRoute(id) {
      this.currentRoute = this.inactiveRoutes[id];
    },
    addMarker({ latlng, insertBefore } = {}) {
      this.navigation.addWaypoint({ latlng, insertBefore }, this.currentRoute);
    },
    removeMarker(id) {
      this.navigation.removeWaypoint(id, this.currentRoute);
      if (this.navigation.clearRoute(this.currentRoute))
        this.currentRoute = null;
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
          this.isNavigationManagerActive = true;
          break;
        case "clear":
          if (this.navigation) this.navigation.removeRoute(this.currentRoute);
          this.currentRoute = null;
          this.$nextTick(() => (this.tool = null));
          break;
      }
    },
    currentRoute(route) {
      if (!route) this.tool = null;
    }
  }
};
