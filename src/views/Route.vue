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
          position: 'topleft',
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
        @click-trace="addMarker"
      />

      <l-route-layer-group
        v-for="(route, id) in inactiveRoutes"
        :value="route"
        :key="id"
        :active="false"
        @click-waypoint="selectRoute(id)"
        @click-trace="selectRoute(id)"
      />
      <l-polyline
        v-if="pointerVector.every((i) => i && i.lat && i.lng)"
        :lat-lngs="pointerVector"
        className="pointerVector"
        dashArray="40, 30, 10, 30"
      />
      <l-control position="topright">
        <NavigationSummary
          v-bind="navigation"
          :selected="navigation.routes.indexOf(currentRoute)"
          @select="selectRoute"
        />
      </l-control>
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
import NavigationSummary from "@/components/NavigationSummary.vue";
import L from "leaflet";
import "@/mixins/leaflet.patch";
import "leaflet/dist/leaflet.css";

import { LMap, LPolyline, LControl } from "vue2-leaflet";
import LBaseLayerGroup from "@/components/LBaseLayerGroup.vue";

import LRouteToolboxControl from "@/components/LRouteToolboxControl.vue";
import LRouteLayerGroup from "@/components/LRouteLayerGroup.vue";

import LControlGeocoder from "@/components/LControlGeocoder";
import VueLeafletMinimap from "vue-leaflet-minimap";
import LControlFullscreen from "vue2-leaflet-fullscreen";

import { MapTools } from "@/mixins/MapTools";

export default {
  name: "Route",
  components: {
    NavigationSelect,
    NavigationSummary,
    LMap,
    LPolyline,
    LControl,
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
      navigation: { name: undefined, routes: [] },
      miniMap: {
        layer: new L.TileLayer(
          "https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/{z}/{x}/{y}?access_token={token}",
          {
            username: "mabrenac",
            style_id: "ckflgd4gu1gv519ocwjauheyd",
            token:
              "pk.eyJ1IjoibWFicmVuYWMiLCJhIjoiY2sxbm1ueWhjMDd6aTNvcWZhNWVzejEyZiJ9.y6D5gNxGbMDJnzd0CSW9xQ",
            crossOrigin: true,
          }
        ),
        options: {
          toggleDisplay: true,
          minimized: false,
          position: "bottomright",
        },
      },
    };
  },
};

// https://en.wikipedia.org/wiki/Decimal_degrees
// https://wiki.openstreetmap.org/wiki/Precision_of_coordinates
</script>
