<template>
  <section style="height: 100%">
    <NavigationSelect />
    <AircraftSelect />

    <l-map
      ref="movingMap"
      :options="{
        zoomSnap: 0.5
      }"
      @ready="setupMap"
      @contextmenu="setDestination"
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
        v-if="lastKnownLocation && destination"
        :from="lastKnownLocation"
        :to="destination"
        position="bottomright"
      />
      <l-location-marker
        v-model="lastKnownLocation"
        :delay="futurPositionDelay"
      />

      <l-polyline v-if="!!trace" :lat-lngs="trace" className="traceLine" />

      <l-route-layer-group
        v-for="(route, id) in navigation.routes"
        :value="route"
        :key="id"
        :active="false"
        @contextmenu-waypoint="setDestination(route[$event])"
      />
      <l-destination-marker v-model="destination" :origin="lastKnownLocation" />
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

import { Waypoint } from "@/models/Waypoint.js";

import { WakeLock } from "@/mixins/apputils.js";

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
  mixins: [WakeLock, MapHandlers],
  data() {
    return {
      lastKnownLocation: undefined,
      lastKnownError: undefined,
      destination: undefined,
      traceDB: "navue_trace",
      traceType: "location",
      futurPositionDelay: 3 * 60,
      minDestination: 100,
      traceLength: 200,
      settings: {
        getLocation: true,
        setView: true,
        inFlight: false
      }
    };
  },
  beforeDestroy() {
    this.stopLocate();
  },
  computed: {
    map() {
      return this.$refs.movingMap.mapObject;
    },
    navigation() {
      return this.$store.state.currentNavigation || { routes: [] };
    },
    trace() {
      return (this.reportedLocations || []).map(p => [p.latitude, p.longitude]);
    }
  },
  watch: {
    "settings.setView": function(val) {
      if (val && this.lastKnownLocation) this.bestView(this.lastKnownLocation);
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
        limit: this.traceLength,
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
    // FIXME: toBounds do not work well in potrait.
    bestView(e) {
      this.map.flyToBounds(
        e.toBounds(e.speed ? e.speed * this.futurPositionDelay : e.accuracy),
        { padding: [100, 100] }
      );
    },
    addLocation(e) {
      return this.$pouch[this.traceDB].post(
        {
          ...e,
          _id: e.timestamp.toString()
        },
        {}
      );
    },
    removeLocations() {
      this.$pouch[this.traceDB]
        .destroy()
        .then(() => {
          // FIXME: this is a workaround for updating livefeed
          let keep = this.traceType;
          this.traceType = null;
          this.traceType = keep;
        })
        .catch(console.error);
    },
    setDestination(e) {
      this.destination = new Waypoint(e);
    },
    //TODO : on route select, set a Next Destination
    getDestination(lastDestination) {
      if (
        this.destination &&
        lastDestination.distanceTo(this.destination) < this.minDestination
      ) {
        this.destination = this.navigation.getNextWaypoint(this.destination);
      } else return;
    }
  }
};
</script>
