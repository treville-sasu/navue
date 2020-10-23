<template>
  <section style="height: 100%;">
    <NavigationSelect
      v-model="navigation"
      :activate="!navigation || tool == 'select'"
      :can-cancel="!!navigation"
      @close="tool = undefined"
    />
    <l-map
      v-if="navigation"
      :zoom="6"
      :center="{ lat: 43.34911845652575, lng: -0.012370347976684572 }"
      :options="{
        zoomSnap: 0.5,
      }"
      v-on="mapEvents"
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

      <l-route-toolbox-control v-model="tool" position="bottomleft" />

      <l-route-layer-group
        v-if="currentRoute"
        v-model="currentRoute"
        :active="true"
        @contextmenu-waypoint="removeMarker"
        @click-midpoint="addMarker"
      />

      <l-route-layer-group
        v-for="(route, id) in inactiveRoutes"
        :value="route"
        :key="id"
        :active="false"
        @click-waypoint="selectRoute(id)"
        @click-trace="selectRoute(id)"
        @click-midpoint="selectRoute(id)"
      />
      <l-polyline
        v-if="pointerVector.every((i) => i && i.lat && i.lng)"
        :lat-lngs="pointerVector"
        className="pointerVector"
        dashArray="40, 30, 10, 30"
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
  stroke: $red;
  fill: none;
  opacity: 0.8;
}
</style>

<script>
import NavigationSelect from "@/components/NavigationSelect.vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { LMap, LPolyline } from "vue2-leaflet";
import LBaseLayerGroup from "@/components/LBaseLayerGroup.vue";

import LRouteLayerGroup from "@/components/LRouteLayerGroup.vue";
import LRouteToolboxControl from "@/components/LRouteToolboxControl.vue";

import LControlGeocoder from "@/components/LControlGeocoder";
import VueLeafletMinimap from "vue-leaflet-minimap";
import LControlFullscreen from "vue2-leaflet-fullscreen";

import "@/mixins/leaflet.patch";
import { MapTools } from "@/mixins/MapTools";

export default {
  name: "Route",
  components: {
    NavigationSelect,
    LMap,
    LPolyline,
    LBaseLayerGroup,

    LRouteLayerGroup,
    LRouteToolboxControl,
    VueLeafletMinimap,
    LControlGeocoder,
    LControlFullscreen,
  },
  mixins: [MapTools],
  data() {
    return {
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
};

// https://en.wikipedia.org/wiki/Decimal_degrees
// https://wiki.openstreetmap.org/wiki/Precision_of_coordinates
</script>
