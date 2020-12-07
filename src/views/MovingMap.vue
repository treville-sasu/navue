<template>
  <section style="height: 100%;">
    <NavigationSelect />
    <AircraftSelect />

    <l-map
      ref="movingMap"
      :options="{
        zoomSnap: 0.5
      }"
      @ready="setupMap"
      @contextmenu="nextDestination = $event"
    >
      <l-base-layer-group />
      <l-control-fullscreen position="topleft" />
      <l-moving-map-toolbox-control
        v-model="settings"
        position="bottomleft"
        @delete-track="removeLocations"
      />
      <l-moving-map-instruments-control
        v-model="lastKnownLocation"
        position="topright"
      />

      <l-moving-map-destination-control
        v-if="lastKnownLocation && nextDestination"
        :from="lastKnownLocation"
        :to="nextDestination"
        position="bottomright"
      />
      <l-location-marker
        v-model="lastKnownLocation"
        :delay="futurPositionDelay"
      />

      <l-polyline v-if="!!trace" :lat-lngs="trace" className="traceLine" />

      <l-route-layer-group
        v-for="(route, id) in routes"
        :value="route"
        :key="id"
        :active="false"
        @contextmenu-waypoint="nextDestination = route[$event]"
      />
      <l-destination-marker
        v-model="nextDestination"
        :origin="lastKnownLocation"
      />
    </l-map>
  </section>
</template>

<style lang="scss">
@import "~bulmaswatch/flatly/_variables.scss";

html,
body,
#app {
  height: 100%;
  width: 100%;
}

.traceLine {
  stroke: $turquoise;
  fill: none;
  stroke-width: 5;
  opacity: 0.8;
}
</style>

<script>
import "@/mixins/leaflet.patch";
import "leaflet/dist/leaflet.css";

import { LMap, LPolyline } from "vue2-leaflet";
import LControlFullscreen from "vue2-leaflet-fullscreen";

import { MapHandlers } from "@/mixins/MapHandlers";

import NavigationSelect from "@/components/NavigationSelect.vue";
import AircraftSelect from "@/components/AircraftSelect.vue";

import LBaseLayerGroup from "@/components/LBaseLayerGroup.vue";

import LMovingMapToolboxControl from "@/components/LMovingMapToolboxControl.vue";
import LMovingMapInstrumentsControl from "@/components/LMovingMapInstrumentsControl.vue";
import LMovingMapDestinationControl from "@/components/LMovingMapDestinationControl.vue";

import LLocationMarker from "@/components/LLocationMarker.vue";
import LDestinationMarker from "@/components/LDestinationMarker.vue";
import LRouteLayerGroup from "@/components/LRouteLayerGroup.vue";

// FIXME: Setview with futur and past value
export default {
  name: "MovingMap",
  components: {
    NavigationSelect,
    AircraftSelect,
    LMap,
    LControlFullscreen,
    LPolyline,
    LBaseLayerGroup,
    LMovingMapToolboxControl,
    LMovingMapInstrumentsControl,
    LMovingMapDestinationControl,
    LLocationMarker,
    LRouteLayerGroup,
    LDestinationMarker
  },
  mixins: [MapHandlers],
  data() {
    return {
      lastKnownLocation: undefined,
      lastKnownError: undefined,
      nextDestination: undefined,
      wakeLock: null,
      traceDB: "navue_trace",
      traceType: "location",
      futurPositionDelay: 3 * 60,
      minDestination: 100,
      settings: {
        getLocation: true,
        setView: true,
        wakeLock: true,
        inFlight: false,
        allowWarning: true
      }
    };
  },
  mounted() {
    this.requestWakeLock();
    document.addEventListener("visibilitychange", this.requestWakeLock);
  },
  beforeDestroy() {
    this.stopLocate();
    document.removeEventListener("visibilitychange", this.requestWakeLock);
    if (this.wakeLock) this.wakeLock.release();
  },
  computed: {
    map() {
      return this.$refs.movingMap.mapObject;
    },
    routes() {
      try {
        return this.$store.state.currentNavigation.routes;
      } catch {
        return null;
      }
    },
    trace() {
      return (this.reportedLocations || [])
        .filter(p => !!p.latlng)
        .map(p => p.latlng);
    }
  },
  watch: {
    "settings.setView": function(val) {
      if (val && this.lastKnownLocation) this.bestView(this.lastKnownLocation);
    },
    "settings.wakeLock": function(val) {
      if (val) this.requestWakeLock();
      if (!val && this.wakeLock) this.wakeLock.release();
    },
    "settings.getLocation": {
      handler(val) {
        val ? this.startLocate() : this.stopLocate();
      }
    }
  },
  pouch: {
    reportedLocations() {
      return {
        database: this.traceDB,
        selector: {
          type: this.traceType
        }
      };
    }
  },
  methods: {
    setupMap(map) {
      map
        .on("locationfound", this._locationFound, this)
        .on("locationerror", this._locationError, this);

      if (this.settings.getLocation) this.startLocate();
    },
    bestView(e) {
      this.map.flyToBounds(
        e.latlng
          .toBounds(e.speed ? e.speed * this.futurPositionDelay : e.accuracy)
          .pad(0.1)
      );
    },
    addLocation(e) {
      return this.$pouch[this.traceDB].post(
        {
          ...e,
          type: "location",
          _id: e.timestamp.toString()
        },
        {}
      );
    },
    removeLocations() {
      this.$pouch[this.traceDB]
        .destroy()
        .then(() => {
          // FIXME: workaround for updating livefeed
          let keep = this.traceType;
          this.traceType = null;
          this.traceType = keep;
        })
        .catch(console.error);
    },
    setNextDestination(e) {
      if (
        this.nextDestination &&
        e.latlng.distanceTo(this.nextDestination.latlng) < this.minDestination
      ) {
        if (this.routes)
          this.nextDestination = this.getNextWaypoint(
            this.routes,
            this.nextDestination
          );
        else this.nextDestination = null;
      } else return;
    },
    getNextWaypoint(routes, current) {
      //TODO should we get to next route or return null ?
      let routeId = routes.findIndex(rte => rte.indexOf(current) > -1);
      if (routeId > -1) {
        let currentRoute = routes[routeId];
        let waypointId = currentRoute.indexOf(current);
        if (currentRoute.length - 1 > waypointId)
          return currentRoute[waypointId + 1];
      }
      return null;
    },
    async requestWakeLock() {
      try {
        if ("wakeLock" in navigator && document.visibilityState === "visible") {
          this.wakeLock = await navigator.wakeLock.request("screen");
        } else throw "wakelock unavaliable";
      } catch (err) {
        this.settings.wakeLock = false;
      }
    },
    openWarning(e) {
      this.$buefy.snackbar.open({
        message: e.message,
        position: "is-bottom",
        type: "is-danger",
        duration: 5000,
        actionText: "Deactivate",
        onAction: () => {
          this.settings.allowWarning = false;
          this.$buefy.toast.open({
            message: "Warnings Deactivated",
            queue: false
          });
        }
      });
    }
  }
};
</script>
