<template>
  <section style="height: 100%;">
    <l-map
      :zoom="6"
      :center="{ lat: 43.34911845652575, lng: -0.012370347976684572 }"
      :options="{
        zoomSnap: 0.5,
      }"
      ref="routeMap"
      v-on="mapEventsHandlers"
    >
      <l-base-layer-group />

      <vue-leaflet-minimap v-bind="miniMap" />

      <l-control-geocoder
        :options="{
          showResultIcons: true,
          showUniqueResult: true,
          defaultMarkGeocode: false,
        }"
      />
      <l-control-fullscreen position="topleft" />

      <l-polyline
        v-if="pointerVector.every((i) => i && i.lat && i.lng)"
        :lat-lngs="pointerVector"
        className="pointerVector"
      />
    </l-map>
  </section>
</template>

<style lang="scss">
@import "~leaflet-minimap/dist/Control.MiniMap.min.css";
@import "~bulmaswatch/flatly/_variables.scss";
html,
body,
#app {
  height: 100%;
  width: 100%;
}

.pointerVector {
  stroke: $turquoise;
  stroke-dasharray: "4, 3, 1, 3";
  fill: none;
  opacity: 0.5;
}
</style>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { LMap, LPolyline } from "vue2-leaflet";
import LBaseLayerGroup from "@/components/LBaseLayerGroup.vue";

import LControlGeocoder from "@/components/LControlGeocoder";
import VueLeafletMinimap from "vue-leaflet-minimap";
import LControlFullscreen from "vue2-leaflet-fullscreen";

import "@/mixins/leaflet.patch";
import { UnitSystem } from "@/mixins/apputils";

export default {
  name: "Route",
  components: {
    LMap,
    LPolyline,
    LBaseLayerGroup,

    VueLeafletMinimap,
    LControlGeocoder,
    LControlFullscreen,
  },
  mixins: [UnitSystem],
  data() {
    return {
      pointerVector: [null, null],

      elevationLayer: {
        url:
          "https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token={token}",
        attribution: '© <a href="https://www.mapbox.com/">Mapbox</a>',
        options: {
          crossOrigin: true,
          token:
            "pk.eyJ1IjoibWFicmVuYWMiLCJhIjoiY2sxbm1ueWhjMDd6aTNvcWZhNWVzejEyZiJ9.y6D5gNxGbMDJnzd0CSW9xQ",
        },
        decoder: (r, g, b) => -10000 + (r * 256 * 256 + g * 256 + b) * 0.1,
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
  computed: {
    mapEventsHandlers() {
      let defaultEvents = {
        ready: this.setupMap,
      };
      return defaultEvents;
    },
  },
  methods: {
    setupMap(e) {
      this.map = e;
      // this.map = this.$refs.routeMap.mapObject;
    },
    updatePointer(e) {
      this.pointerVector.splice(1, 1, e ? e.latlng : null);
    },
  },
};

// https://en.wikipedia.org/wiki/Decimal_degrees
// https://wiki.openstreetmap.org/wiki/Precision_of_coordinates
</script>
