<template>
  <section style="height: 100%">
    <b-modal
      v-model="isNavigationManagerActive"
      trap-focus
      destroy-on-hide
      has-modal-card
      aria-role="dialog"
      aria-modal
      @after-leave="tool = null"
    >
      <template #default="props">
        <div class="modal-card">
          <NavigationManager select create save @input="props.close" />
        </div>
      </template>
    </b-modal>

    <l-map v-bind="fullMapSettings" v-on="mapEvents">
      <l-base-layer-group />

      <vue-leaflet-minimap v-bind="miniMapSettings" />

      <l-control-geocoder
        :options="{
          position: 'topleft',
          showResultIcons: true,
          showUniqueResult: true,
          defaultMarkGeocode: false
        }"
      />

      <l-route-toolbox-control v-model="tool" position="bottomleft" />

      <l-route-layer-group
        v-if="currentRoute"
        v-model="currentRoute.items"
        :active="true"
        @contextmenu-waypoint="removeMarker"
        @click-trace="addMarker"
      />

      <l-route-layer-group
        v-for="(route, id) in inactiveRoutes"
        :value="route.items"
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
import NavigationManager from "@/components/NavigationManager.vue";
import L from "leaflet";
import "@/mixins/leaflet.patch";
import "leaflet/dist/leaflet.css";

import { LMap, LPolyline } from "vue2-leaflet";
import LBaseLayerGroup from "@/components/leaflet/LBaseLayerGroup.vue";

import LRouteToolboxControl from "@/components/leaflet/LRouteToolboxControl.vue";
import LRouteLayerGroup from "@/components/leaflet/LRouteLayerGroup.vue";

import LControlGeocoder from "@/components/leaflet/LControlGeocoder";
import VueLeafletMinimap from "vue-leaflet-minimap";

import { MapTools } from "@/mixins/MapTools";

export default {
  name: "Route",
  components: {
    NavigationManager,
    LMap,
    LPolyline,
    LBaseLayerGroup,
    LRouteLayerGroup,
    LRouteToolboxControl,
    VueLeafletMinimap,
    LControlGeocoder
  },
  mixins: [MapTools],
  data() {
    return {
      isNavigationManagerActive: false,
      fullMapSettings: {
        zoom: 10,
        center: { lat: 42.69597591582309, lng: 2.879308462142945 },
        options: {
          zoomSnap: 0.5,
          attributionControl: false
        }
      },
      miniMapSettings: {
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
    },
    navigation: {
      get() {
        return this.$store.state.currentNavigation;
      },
      set(val) {
        this.$store.commit("currentNavigation", val);
      }
    }
  },
  watch: {
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
  }
};
</script>
