<template>
  <section style="height: 100%">
    <b-modal
      v-model="settings.navigationSelect"
      trap-focus
      destroy-on-hide
      has-modal-card
      aria-role="dialog"
      aria-modal
      @after-leave="tool = null"
    >
      <template #default="props">
        <div class="modal-card">
          <NavigationSelect @input="props.close" select />
        </div>
      </template>
    </b-modal>
    <l-map
      ref="movingMap"
      :zoom="10"
      :center="{ lat: 42.69597591582309, lng: 2.879308462142945 }"
      :options="{
        zoomSnap: 0.5,
        zoomControl: false,
        attributionControl: false
      }"
      @ready="setupMap"
      @contextmenu="setDestination"
    >
      <l-moving-map-settings-control
        position="topleft"
        v-bind="settings"
        @update:settings="updateSettings"
        @delete-track="removeLocations"
      />
      <l-control-zoom v-if="settings.zoomControl" position="topleft" />
      <l-moving-map-toolbox-control
        position="bottomleft"
        v-if="!settings.inFlight"
        @update:settings="updateSettings"
      />
      <l-moving-map-instruments-control
        v-model="lastKnownLocation"
        position="topright"
      />
      <l-moving-map-destination-control
        v-if="lastKnownLocation && destination"
        :from="lastKnownLocation"
        :to="destination"
        position="bottomleft"
      />
      <l-time-control
        @update:settings="updateSettings"
        position="bottomright"
      />

      <l-base-layer-group />

      <l-location-marker
        v-model="lastKnownLocation"
        :delay="settings.futurPositionDelay"
      />

      <l-polyline v-if="!!trace" :lat-lngs="trace" className="traceLine" />

      <l-route-layer-group
        v-for="(route, id) in routes"
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
import NavigationSelect from "@/components/NavigationSelect.vue";

import "@/mixins/leaflet.patch";
import "leaflet/dist/leaflet.css";

import { LMap, LPolyline, LControlZoom } from "vue2-leaflet";

import { MapHandlers } from "@/mixins/MapHandlers";

import LBaseLayerGroup from "@/components/LBaseLayerGroup.vue";

import LMovingMapSettingsControl from "@/components/LMovingMapSettingsControl.vue";
import LMovingMapToolboxControl from "@/components/LMovingMapToolboxControl.vue";
import LMovingMapInstrumentsControl from "@/components/LMovingMapInstrumentsControl.vue";
import LMovingMapDestinationControl from "@/components/LMovingMapDestinationControl.vue";
import LTimeControl from "@/components/LTimeControl.vue";

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
    LMap,
    LControlZoom,
    LPolyline,
    LBaseLayerGroup,
    LMovingMapSettingsControl,
    LMovingMapToolboxControl,
    LMovingMapInstrumentsControl,
    LMovingMapDestinationControl,
    LTimeControl,
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
      settings: {
        getLocation: true,
        setView: true,
        fullScreen: !!document.fullscreenElement,
        zoomControl: false,
        inFlight: false,
        navigationSelect: false,
        traceLength: 200,
        minDestination: 100,
        futurPositionDelay: 3 * 60
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
    trace() {
      return (this.reportedLocations || []).map(p => [p.latitude, p.longitude]);
    },
    navigation() {
      return this.$store.state.currentNavigation;
    },
    routes() {
      return this.navigation ? this.navigation.routes : [];
    }
  },
  watch: {
    "settings.setView": function(val) {
      if (val && this.lastKnownLocation) this.bestView(this.lastKnownLocation);
    },
    "settings.fullScreen": function(val) {
      this.toggleFullscreen(this.map.getContainer(), val);
    },
    "settings.getLocation": function(val) {
      val ? this.startLocate() : this.stopLocate();
    },
    "settings.inFlight": function(val) {
      this.settings.fullScreen = val;
    }
  },
  pouch: {
    reportedLocations() {
      return {
        database: this.traceDB,
        limit: this.settings.traceLength,
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
      // FIXME: toBounds do not work well in portrait.
      this.map.flyToBounds(
        e.toBounds(
          e.speed ? e.speed * this.settings.futurPositionDelay : e.accuracy
        ),
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
          // MEMO: this is a workaround for updating livefeed
          let keep = this.traceType;
          this.traceType = null;
          this.traceType = keep;
        })
        .catch(console.error);
    },
    setDestination(e) {
      this.destination = new Waypoint(e);
    },
    getDestination(lastDestination) {
      //TODO : on route select, set a Next Destination
      if (
        this.destination &&
        lastDestination.distanceTo(this.destination) <
          this.settings.minDestination
      ) {
        this.destination = this.navigation.getNextWaypoint(this.destination);
      } else return;
    },
    updateSettings(opts) {
      this.settings = { ...this.settings, ...opts };
    },
    toggleFullscreen(element, force) {
      if (force == undefined)
        if (!document.fullscreenElement) element.requestFullscreen();
        else document.exitFullscreen();
      else if (force) element.requestFullscreen();
      else document.exitFullscreen();
    }
  }
};
</script>
