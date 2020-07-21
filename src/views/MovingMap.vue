<template>
  <section style="height: 100%;">
    <l-map
      ref="routeMap"
      :options="{
        zoomSnap: 0.5
      }"
      @ready="setupMap"
      @contextmenu="nextDestination = $event.latlng"
    >
      <BaseMapsLayers />
      <MovingMapInstruments v-model="lastKnowLocation" />
      <LocationMarker v-model="lastKnowLocation" />
      <MovingMapSettings v-model="settings" />

      <l-polyline
        v-if="!!trace"
        :lat-lngs="trace"
        color="black"
        :opacity="0.5"
        :weight="5"
      />
      <l-marker
        v-if="!!nextDestination"
        :lat-lng="nextDestination"
        @contextmenu="nextDestination = undefined"
      />

      <l-polyline
        ref="nextDestination"
        v-if="!!nextDestination"
        :lat-lngs="nextDestinationRoute"
        color="blue"
        :weight="5"
      />
      <vue-leaflet-minimap
        :layer="miniMap.layer"
        :options="{
          toggleDisplay: true,
          minimized: true,
          position: 'bottomright'
        }"
      ></vue-leaflet-minimap>
    </l-map>
  </section>
</template>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
}
</style>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "@/mixins/leaflet.patch";
import "leaflet-textpath";

import { LMap, LPolyline, LMarker } from "vue2-leaflet";
import VueLeafletMinimap from "vue-leaflet-minimap";
import "leaflet-minimap/dist/Control.MiniMap.min.css";

import { MapHandlers } from "@/mixins/MapHandlers";
import NoSleep from "nosleep.js";

import BaseMapsLayers from "@/components/BaseMapsLayers.vue";
import MovingMapSettings from "@/components/MovingMapSettings.vue";
import MovingMapInstruments from "@/components/MovingMapInstruments.vue";
import LocationMarker from "@/components/LocationMarker.vue";

export default {
  name: "MovingMap",
  components: {
    LMap,
    LMarker,
    LPolyline,
    BaseMapsLayers,
    MovingMapSettings,
    MovingMapInstruments,
    LocationMarker,
    VueLeafletMinimap
  },
  mixins: [MapHandlers],
  data() {
    return {
      lastKnowLocation: undefined,
      lastKnowError: undefined,
      nextDestination: undefined,
      noSleep: new NoSleep(),
      settings: {
        getLocation: true,
        setView: true,
        recordLocation: false,
        allowWarning: true
      },
      miniMap: {
        layer: new L.TileLayer(
          "https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
          {
            subdomains: ["server", "services"]
          }
        ),
        options: {
          toggleDisplay: true,
          minimized: true,
          position: "bottomright"
        }
      }
    };
  },
  mounted() {
    this.noSleep.noSleepVideo.muted = true;
    this.noSleep.enable();
  },
  beforeDestroy() {
    this.stopLocate();
  },
  destroyed() {
    this.noSleep.disable();
  },
  computed: {
    map() {
      return this.$refs.routeMap.mapObject;
    },
    trace() {
      return (this.reportedLocations || [])
        .filter(p => !!p.latlng)
        .map(p => p.latlng);
    },
    nextDestinationRoute() {
      return [this.lastKnowLocation.latlng, this.nextDestination];
    }
  },
  watch: {
    "settings.setView": function(val) {
      if (val && this.lastKnowLocation)
        this.map.fitBounds(this.bestBounds(this.lastKnowLocation));
    },
    "settings.getLocation": {
      handler(val) {
        val ? this.startLocate() : this.stopLocate();
      }
    }
    // nextDestinationRoute: {
    //   deep: true,
    //   handler() {
    //     this.$refs.nextDestination.mapObject.setText(Date.now, { offset: -5 });
    //   },
    // },
  },
  pouch: {
    reportedLocations() {
      return {
        database: "navue",
        selector: {
          type: "location"
        }
      };
    }
  },
  methods: {
    setupMap() {
      this.map
        .on("locationfound", this._locationFound, this)
        .on("locationerror", this._locationError, this);

      if (this.settings.getLocation) this.startLocate();
    },
    // addLocation(payload) {
    //   return this.$store.dispatch("updateDB", {
    //     ...payload,
    //     type: "location",
    //     _id: payload.timestamp.toString(),
    //   });
    // },
    openWarning(e) {
      this.$buefy.snackbar.open({
        message:
          e.message ||
          "Can't get location. check your GPS settings & browser Permission.",
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
    },
    _locationFound: function(e) {
      if (this._debounceLocation(e, this.lastKnowLocation)) {
        if (this.lastKnowLocation) {
          this._computeFromLastLocation(e, this.lastKnowLocation);
        }
        delete e.sourceTarget;
        delete e.target;
        delete e.bounds;
        delete e.latitude;
        delete e.longitude;
        delete e.type;

        this.lastKnowLocation = { ...e };
        // if (this.settings.recordLocation) this.addLocation(e);
        if (this.settings.setView) this.map.fitBounds(this.bestBounds(e));
      } else if (e.type == "locationerror") {
        this._locationError(e);
      }
    },
    _locationError: function(e) {
      delete e.sourceTarget;
      delete e.target;
      e.timestamp = Date.now();

      if (true && e.code == 2) {
        // set a debug Flag ???
        this._locationFound(this._fakeLocation());
        return;
      }

      if (this.settings.allowWarning) this.openWarning(e);
      this.lastKnowError = { ...e };
    }
  }
};
</script>
