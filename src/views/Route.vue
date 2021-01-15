<template>
  <section style="height: 100%">
    <b-modal
      v-model="isNavigationSelectActive"
      trap-focus
      destroy-on-hide
      has-modal-card
      aria-role="dialog"
      aria-modal
      @after-leave="tool = null"
    >
      <template #default="props">
        <div class="modal-card">
          <NavigationSelect
            :value="navigation"
            @input="
              event => {
                props.close();
                navigation = event;
              }
            "
            select
            create
            save
          />
        </div>
      </template>
    </b-modal>
    <!-- TODO: on select navigation setView -->
    <l-map
      :zoom="10"
      :center="{ lat: 42.69597591582309, lng: 2.879308462142945 }"
      :options="{
        zoomSnap: 0.5
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
          defaultMarkGeocode: false
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
        v-if="pointerVector.every(i => i && i.lat && i.lng)"
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
import "@/mixins/leaflet.patch";
import "leaflet/dist/leaflet.css";

import { LMap, LPolyline } from "vue2-leaflet";
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
    LMap,
    LPolyline,
    LBaseLayerGroup,
    LRouteLayerGroup,
    LRouteToolboxControl,
    VueLeafletMinimap,
    LControlGeocoder,
    LControlFullscreen
  },
  mixins: [MapTools],
  data() {
    return {
      isNavigationSelectActive: false,
      navigation: null,
      miniMap: {
        layer: new L.TileLayer(
          "https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/{z}/{x}/{y}?access_token={token}",
          {
            username: "mabrenac",
            style_id: "ckflgd4gu1gv519ocwjauheyd",
            token:
              "pk.eyJ1IjoibWFicmVuYWMiLCJhIjoiY2sxbm1ueWhjMDd6aTNvcWZhNWVzejEyZiJ9.y6D5gNxGbMDJnzd0CSW9xQ",
            crossOrigin: true
          }
        ),
        options: {
          toggleDisplay: true,
          minimized: screen.width < 700,
          position: "bottomright"
        }
      }
    };
  },
  computed: {
    aircraft() {
      return this.$store.state.currentAircraft;
    }
  }
};

// https://en.wikipedia.org/wiki/Decimal_degrees
// https://wiki.openstreetmap.org/wiki/Precision_of_coordinates
</script>
