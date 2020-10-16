<template>
  <section style="height: 100%;">
    <l-map
      ref="movingMap"
      :options="{
        zoomSnap: 0.5,
      }"
      @ready="setupMap"
      @contextmenu="nextDestination = { latlng: $event.latlng }"
    >
      <l-base-layer-group />
      <l-control-fullscreen position="topleft" />
      <l-moving-map-settings-control
        v-model="settings"
        position="topleft"
        @action="removeLocations"
      />
      <l-moving-map-instruments-control
        v-model="lastKnownLocation"
        position="topright"
      />
      <l-location-marker v-model="lastKnownLocation" :futur="60" />

      <l-polyline
        v-if="!!trace"
        :lat-lngs="trace"
        color="black"
        :opacity="0.5"
        :weight="5"
      />

      <l-destination-marker
        v-model="nextDestination"
        :origin="lastKnownLocation"
      />
      <vue-leaflet-minimap
        :layer="miniMap.layer"
        :options="{
          toggleDisplay: true,
          minimized: true,
          position: 'bottomright',
        }"
      ></vue-leaflet-minimap>
    </l-map>
  </section>
</template>

<style>
@import "~leaflet-minimap/dist/Control.MiniMap.min.css";

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

import { LMap, LPolyline } from "vue2-leaflet";
import VueLeafletMinimap from "vue-leaflet-minimap";
import "leaflet-minimap/dist/Control.MiniMap.min.css";
import LControlFullscreen from "vue2-leaflet-fullscreen";

import { MapHandlers } from "@/mixins/MapHandlers";

import LBaseLayerGroup from "@/components/LBaseLayerGroup.vue";
import LMovingMapSettingsControl from "@/components/LMovingMapSettingsControl.vue";
import LMovingMapInstrumentsControl from "@/components/LMovingMapInstrumentsControl.vue";
import LLocationMarker from "@/components/LLocationMarker.vue";
import LDestinationMarker from "@/components/LDestinationMarker.vue";

export default {
  name: "MovingMap",
  components: {
    LMap,
    LControlFullscreen,
    LPolyline,
    LBaseLayerGroup,
    LMovingMapSettingsControl,
    LMovingMapInstrumentsControl,
    LLocationMarker,
    LDestinationMarker,
    VueLeafletMinimap,
  },
  mixins: [MapHandlers],
  data() {
    return {
      lastKnownLocation: undefined,
      lastKnownError: undefined,
      nextDestination: undefined,
      wakeLock: null,
      settings: {
        getLocation: true,
        setView: true,
        wakeLock: true,
        recordLocation: false,
        allowWarning: true,
      },
      miniMap: {
        layer: new L.TileLayer(
          "https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
          {
            subdomains: ["server", "services"],
          }
        ),
        options: {
          toggleDisplay: true,
          minimized: true,
          position: "bottomright",
        },
      },
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
    trace() {
      return (this.reportedLocations || [])
        .filter((p) => !!p.latlng)
        .map((p) => p.latlng);
    },
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
      },
    },
  },
  pouch: {
    reportedLocations() {
      return {
        database: "navue",
        selector: {
          type: "location",
        },
      };
    },
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
        e.latlng.toBounds(e.speed ? e.speed * 60 : e.accuracy)
      );
    },
    addLocation(e) {
      return this.$pouch.post({
        ...e,
        type: "location",
        _id: e.timestamp.toString(),
      });
    },
    removeLocations() {
      this.$pouch.bulkDocs(
        this.reportedLocations.map((loc) => {
          return { ...loc, _deleted: true };
        })
      );
    },
    async requestWakeLock() {
      try {
        if ("wakeLock" in navigator && document.visibilityState === "visible") {
          this.wakeLock = await navigator.wakeLock.request("screen");
        } else throw "wakelock unavaliable";
      } catch (err) {
        this.settings.wakeLock = false;
        // this.openWarning({
        //   message: "Caution : Not able to keep screen on, try another browser",
        // });
        console.error(err);
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
            queue: false,
          });
        },
      });
    },
    _locationFound: function(e) {
      if (this._debounceLocation(e, this.lastKnownLocation)) {
        if (this.lastKnownLocation) {
          this._computeFromLastLocation(e, this.lastKnownLocation);
        }
        delete e.sourceTarget;
        delete e.target;
        delete e.bounds;
        delete e.latitude;
        delete e.longitude;

        this.lastKnownLocation = { ...e };
        if (this.settings.recordLocation) this.addLocation(e);
        if (this.settings.setView) this.bestView(e);
      } else if (e.type == "locationerror") this._locationError(e);
    },
    _locationError: function(e) {
      delete e.sourceTarget;
      delete e.target;
      e.timestamp = Date.now();

      if (process.env.NODE_ENV == "development") {
        //&& e.code == 2
        console.error(e.message);
        this._locationFound(this._fakeLocation({ ...e, accuracy: 10 }));
        return;
      }

      if (this.settings.allowWarning) this.openWarning(e);
      this.lastKnownError = { ...e };
    },
  },
};
</script>
