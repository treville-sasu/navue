<template>
  <section style="height: 100%">
    <l-map
      ref="movingMap"
      v-bind="settings.map"
      @ready="setupMap"
      @contextmenu="setDestination"
    >
      <l-control position="topleft">
        <b-field class="stackable" addons>
          <MovingMapSettings
            v-bind="settings"
            @update:settings="updateSettings"
            position="is-bottom-right"
            :triggers="['click', 'hover']"
          />
          <DataToolbar
            navigation
            aircraft
            flight
            :traceDB="traceDB"
            :dropdown="{
              position: 'is-bottom-right',
              triggers: ['click', 'hover']
            }"
          />
        </b-field>
      </l-control>

      <l-control-zoom v-if="settings.zoomControl" position="topleft" />

      <l-control position="bottomleft">
        <ReportToolbar
          :tooltip="{ position: 'is-top' }"
          class="stackable"
          navlog
          checklists
          vac
          weather
          aip
          notepad
        />
      </l-control>
      <l-control position="bottomleft">
        <DestinationDisplay
          v-if="lastKnownLocation && destination"
          :from="lastKnownLocation"
          :to="destination"
        />
      </l-control>
      <l-control position="topright">
        <InstrumentsDisplay class="stackable" />
      </l-control>
      <l-control position="bottomright">
        <TimerToolbar @update:settings="updateSettings" />
      </l-control>

      <l-base-layer-group />

      <l-location-marker
        :v-if="lastKnownLocation"
        :value="lastKnownLocation"
        :unsure="!!lastKnowError"
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

import { LMap, LControlZoom, LControl, LPolyline } from "vue2-leaflet";

import { MapHandlers } from "@/mixins/MapHandlers";

import MovingMapSettings from "@/components/MovingMapSettings.vue";
import InstrumentsDisplay from "@/components/InstrumentsDisplay.vue";
import DestinationDisplay from "@/components/DestinationDisplay.vue";
import TimerToolbar from "@/components/TimerToolbar.vue";
import ReportToolbar from "@/components/ReportToolbar.vue";
import DataToolbar from "@/components/DataToolbar.vue";

import LBaseLayerGroup from "@/components/leaflet/LBaseLayerGroup.vue";
import LLocationMarker from "@/components/leaflet/LLocationMarker.vue";
import LDestinationMarker from "@/components/leaflet/LDestinationMarker.vue";
import LRouteLayerGroup from "@/components/leaflet/LRouteLayerGroup.vue";

import { Waypoint } from "@/models/Waypoint.js";
import { WakeLock } from "@/mixins/apputils.js";

// FIXME: Setview with futur and past value
export default {
  name: "MovingMap",
  components: {
    LMap,
    LControlZoom,
    LControl,
    LPolyline,
    MovingMapSettings,
    InstrumentsDisplay,
    DestinationDisplay,
    TimerToolbar,
    ReportToolbar,
    DataToolbar,
    LBaseLayerGroup,
    LLocationMarker,
    LRouteLayerGroup,
    LDestinationMarker
  },
  mixins: [WakeLock, MapHandlers],
  data() {
    return {
      destination: undefined,
      lastKnowError: undefined,
      traceDB: "navue_trace",
      traceType: "Location",
      trace: [[]],
      settings: {
        getLocation: true,
        setView: true,
        fullScreen: !!document.fullscreenElement,
        zoomControl: false,
        inFlight: false,
        traceLength: 250,
        minDestination: 100,
        futurPositionDelay: 3,
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
  async created() {
    this.$pouch.getDB(this.traceDB);
    this.trace = await this.reducedTrace(this.$pouch[this.traceDB]);

    this.traceFeed = this.$pouch[this.traceDB]
      .on("destroyed", () => {
        this.trace = [[]];
      })
      .changes({
        since: "now",
        live: true,
        include_docs: true
      })
      .on("change", ({ doc: { latitude, longitude } }) => {
        if (latitude && longitude) this.trace[0].unshift([latitude, longitude]);
        else this.trace.unshift([]);
      });
  },
  beforeDestroy() {
    this.traceFeed.cancel();
    this.stopLocate();
  },
  computed: {
    map() {
      return this.$refs.movingMap.mapObject;
    },
    navigation() {
      return this.$store.state.currentNavigation;
    },
    routes() {
      return this.navigation ? this.navigation.routes : [];
    },
    lastKnownLocation: {
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
      if (val && this.lastKnownLocation) this.bestView(this.lastKnownLocation);
    },
    "settings.fullScreen": function(val) {
      this.toggleFullscreen(this.map.getContainer(), val);
    },
    "settings.getLocation": function(val) {
      val ? this.startLocate() : this.stopLocate();
    },
    "settings.inFlight": function(val) {
      if (!val) this.addLocation({ type: "EndFlight", timestamp: Date.now() });
      this.settings.fullScreen = val;
    },
    navigation(nav) {
      try {
        let bounds = nav.toBounds();
        this.map.flyToBounds(bounds, {
          padding: [50, 50]
        });
      } catch {
        /* continue regardless of error */
      }
    }
  },
  methods: {
    reducedTrace(db) {
      return db
        .query(
          {
            map: (doc, emit) => {
              if (doc.latitude && doc.longitude)
                emit(0, [doc.latitude, doc.longitude]);
            },
            reduce: (keys, values) => {
              return values;
            }
          },
          { group: true }
        )
        .then(({ rows }) => {
          return rows.reduce((acc, row) => {
            acc.unshift(row.value);
            return acc;
          }, []);
        });
    },
    setupMap() {
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
      asJSON._id = payload.timestamp.toString();
      return this.$pouch[this.traceDB].put(asJSON);
    },
    setDestination({ latlng, latitude, longitude, altitude } = {}) {
      this.destination = Waypoint.from({
        latlng,
        latitude,
        longitude,
        altitude,
        type: "Waypoint"
      });
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
