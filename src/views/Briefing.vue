<template>
  <section style="height: 100%">
    <l-map v-bind="fullMapSettings" v-on="mapEvents">
      <l-base-layer-group />

      <vue-leaflet-minimap v-bind="miniMapSettings" />

      <l-control position="topleft">
        <b-field class="is-stackable" addons>
          <DataToolbar
            :navigation="{
              create: true,
              edit: true
            }"
            aircraft
            :dropdown="{
              position: 'is-bottom-right',
              triggers: ['click', 'hover']
            }"
          />
        </b-field>
      </l-control>

      <l-control-geocoder
        :options="{
          position: 'topleft',
          showResultIcons: true,
          showUniqueResult: true,
          defaultMarkGeocode: false
        }"
      />

      <l-control position="bottomleft">
        <ReportToolbar
          :tooltip="{ position: 'is-top' }"
          class="is-stackable"
          vac
          weather
          aip
          balance
        />
      </l-control>
      <l-control position="topright">
        <RouteToolbox
          :tooltip="{ position: 'is-bottom' }"
          class="is-stackable"
          v-model="tool"
        />
      </l-control>

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
import L from "leaflet";
import "@/mixins/leaflet.patch";
import "leaflet/dist/leaflet.css";

import { LMap, LPolyline, LControl } from "vue2-leaflet";
import LBaseLayerGroup from "@/components/leaflet/LBaseLayerGroup.vue";

import LRouteLayerGroup from "@/components/leaflet/LRouteLayerGroup.vue";

import LControlGeocoder from "@/components/leaflet/LControlGeocoder";
import VueLeafletMinimap from "vue-leaflet-minimap";

import DataToolbar from "@/components/DataToolbar.vue";

import RouteToolbox from "@/components/RouteToolbox";
import ReportToolbar from "@/components/ReportToolbar.vue";

import { RouteHandler } from "@/mixins/RouteHandler";

export default {
  name: "Route",
  components: {
    LMap,
    LPolyline,
    LControl,
    LBaseLayerGroup,
    LRouteLayerGroup,
    VueLeafletMinimap,
    LControlGeocoder,
    DataToolbar,
    RouteToolbox,
    ReportToolbar
  },
  mixins: [RouteHandler],
  data() {
    return {
      isNavigationManagerActive: false,
      fullMapSettings: {
        zoom: 10,
        center: { lat: 42.69597591582309, lng: 2.879308462142945 },
        options: {
          zoomSnap: 0.5,
          zoomControl: false,
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
