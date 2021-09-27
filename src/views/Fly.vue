<template>
  <section style="height: 100%">
    <l-map
      ref="movingMap"
      v-bind="settings.map"
      @ready="setupMap"
      @contextmenu="setDestination"
    >
      <l-control position="topleft">
        <b-field class="is-stackable">
          <MovingMapSettings
            v-bind="settings"
            @update:settings="updateSettings"
            position="is-bottom-right"
            :triggers="['click', 'hover']"
          />
          <DataToolbox
            v-if="!settings.inFlight"
            location
            navigation
            aircraft
            :flight="{ persistent: true, trace: traceDB }"
            :dropdown="{
              position: 'is-bottom-right',
              triggers: ['click', 'hover']
            }"
          />
        </b-field>
      </l-control>

      <l-control-zoom v-if="settings.zoomControl" position="topleft" />

      <l-control position="bottomleft">
        <ReportToolbox
          :tooltip="{ position: 'is-top' }"
          class="is-stackable"
          navlog
          checklists
          vac
          weather
          aip
          notepad
        />
      </l-control>
      <l-control position="topright">
        <InstrumentsDisplay class="is-stackable" v-bind="currentLocation" />
      </l-control>
      <l-control position="bottomright">
        <TimerToolbox @update:settings="updateSettings" />
      </l-control>

      <l-base-layer-group />

      <l-location-marker
        :v-if="currentLocation"
        :value="currentLocation"
        :unsure="!!lastError"
        :delay="settings.futurPositionDelay"
      />

      <l-polyline :lat-lngs="trace" className="traceLine" />

      <l-route-layer-group
        v-for="(route, id) in routes"
        :value="route.items"
        :key="id"
        :active="false"
        @contextmenu-waypoint="setDestination(route.items[$event])"
      />
      <l-destination-marker
        :to="currentDestination"
        :from="currentLocation"
        @update="currentDestination = $event"
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

import { LMap, LControlZoom, LControl, LPolyline } from "vue2-leaflet";

import { LocationHandler } from "@/mixins/LocationHandler";
import { TraceHandler } from "@/mixins/TraceHandler";
import { DestinationHandler } from "@/mixins/DestinationHandler";

import MovingMapSettings from "@/components/MovingMapSettings";
import InstrumentsDisplay from "@/components/InstrumentsDisplay";

import TimerToolbox from "@/components/toolboxes/TimerToolbox";
import ReportToolbox from "@/components/toolboxes/ReportToolbox";
import DataToolbox from "@/components/toolboxes/DataToolbox";

import LBaseLayerGroup from "@/components/leaflet/LBaseLayerGroup";
import LLocationMarker from "@/components/leaflet/LLocationMarker";
import LDestinationMarker from "@/components/leaflet/LDestinationMarker";
import LRouteLayerGroup from "@/components/leaflet/LRouteLayerGroup";

import { WakeLock } from "@/mixins/apputils";

export default {
  name: "MovingMap",
  components: {
    LMap,
    LControlZoom,
    LControl,
    LPolyline,
    MovingMapSettings,
    InstrumentsDisplay,
    TimerToolbox,
    ReportToolbox,
    DataToolbox,
    LBaseLayerGroup,
    LLocationMarker,
    LRouteLayerGroup,
    LDestinationMarker
  },
  mixins: [WakeLock, LocationHandler, TraceHandler, DestinationHandler],
  data() {
    return {
      legStart: undefined,
      map: undefined,
      settings: {
        getLocation: true,
        setView: true,
        fullScreen: !!document.fullscreenElement,
        zoomControl: false,
        inFlight: false,
        map: {
          zoom: 10,
          center: { lat: 42.69597591582309, lng: 2.879308462142945 },
          options: {
            zoomSnap: 0.1,
            zoomControl: false,
            attributionControl: false
          }
        }
      }
    };
  },
  provide: function() {
    return {
      getMap: this.getMap
    };
  },
  computed: {
    navigation() {
      return this.$store.state.currentNavigation;
    },
    routes() {
      return this.navigation ? this.navigation.routes : [];
    },
    currentLocation: {
      get() {
        return this.$store.state.currentLocation;
      },
      set(data) {
        this.$store.commit("currentLocation", data);
      }
    },
    flight: {
      get() {
        return this.$store.state.currentFlight;
      },
      set(data) {
        this.$store.commit("currentFlight", data);
      }
    }
  },
  watch: {
    "settings.setView": function(val) {
      if (val && this.currentLocation) this.bestView(this.currentLocation);
    },
    "settings.fullScreen": function(val) {
      this.toggleFullscreen(this.map.getContainer(), val);
    },
    "settings.getLocation": function(val) {
      val ? this.startLocate() : this.stopLocate();
    },
    "settings.inFlight": function(val) {
      if (val) {
        this.newLeg();
        this.addLocation(this.currentLocation);
      }
      this.settings.fullScreen = val;
    },
    navigation(nav) {
      try {
        let bounds = nav.toBounds();
        this.map.flyToBounds(bounds, {
          padding: [25, 25]
        });
      } catch {
        /* continue regardless of error */
      }
    },
    currentLocation(location) {
      if (location && this.settings.setView) this.bestView(location);
      if (location && this.settings.inFlight) this.addLocation(location);
      if (location && this.navigation) {
        let nextDestination = this.getDestination(location);
        if (nextDestination) this.setDestination(nextDestination);
      }
    }
  },
  methods: {
    getMap() {
      return this.map;
    },
    newLeg() {
      this.trace.unshift([]);
      this.legStart = Date.now();
    },
    setupMap(e) {
      this.map = e;
      if (this.settings.getLocation) this.startLocate();
    },
    bestView(location) {
      let bounds = location.toBounds(
        location.speed
          ? location.speed * this.settings.futurPositionDelay * 60 * 2
          : location.accuracy
      );
      this.map.flyToBounds(bounds, { padding: [25, 25] });
    },
    addLocation(payload) {
      let asJSON = JSON.parse(JSON.stringify(payload));
      asJSON._id = `${this.legStart}-${payload.timestamp}`;
      return this.$pouch[this.traceDB].put(asJSON);
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
