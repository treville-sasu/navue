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
      return this.navigation.routes.filter(rte => rte != this.currentRoute);
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
    clearRoute(rte) {
      //FIXME: use Model
      let position = this.navigation.routes.indexOf(rte);
      this.currentRoute = null;
      if (position > -1) this.navigation.routes.splice(position, 1);
    },
    addMarker(e) {
      //FIXME: use Model
      let mk = { latlng: e.latlng, altitude: {}, bearings: [] };

      if (e.insertBefore) this.currentRoute.splice(e.insertBefore, 0, mk);
      else this.currentRoute.push(mk);
    },
    removeMarker(id) {
      //FIXME: use Model
      this.currentRoute.splice(id, 1);
      if (this.currentRoute.length == 0) {
        this.clearRoute(this.currentRoute);
        this.currentRoute = null;
      }
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
          if (this.currentRoute && this.currentRoute.length == 0)
            this.clearRoute(this.currentRoute);
          break;
        case "select":
          this.$store.commit("navigationSelect", false);
          break;
        default:
          this.map._container.style.cursor = null;
      }
      switch (newTool) {
        case "route":
          if (!this.currentRoute)
            this.currentRoute = this.navigation.routes[
              this.navigation.routes.push([]) - 1
            ];
          this.map._container.style.cursor = "crosshair";
          break;
        case "select":
          this.$store.commit("navigationSelect", true);
          break;
        case "clear":
          this.clearRoute(this.currentRoute);
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
