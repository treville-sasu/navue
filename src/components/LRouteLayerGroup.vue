<template>
  <l-layer-group>
    <l-marker
      v-for="(wp, id) in value"
      :key="id"
      :lat-lng.sync="wp.latlng"
      :name="wp.position"
      :draggable="active"
      @click="$emit('click-waypoint', id)"
      @contextmenu="$emit('contextmenu-waypoint', id)"
    >
      <l-icon
        :icon-anchor="[20, 16]"
        :icon-size="[40, 40]"
        className="leaflet-course-icon"
      >
        <div class="leaflet-course-point"></div>
      </l-icon>
      <l-popup
        :options="{
          closeButton: true,
          className: 'leaflet-waypoint-popup',
          maxWidth: '60vw',
        }"
        v-if="active"
      >
        <WaypointContent v-model="value[id]" />
      </l-popup>
    </l-marker>

    <l-polyline
      :lat-lngs="waypointsPosition"
      :className="active ? 'routeTrace' : 'inactiveRoute'"
      @contextmenu="$emit('contextmenu-trace')"
      @click="$emit('click-trace')"
    />

    <l-marker
      v-for="(midpoint, index) in midpoints"
      :lat-lng="midpoint.latlng"
      :rotationAngle="midpoint.bearing"
      :key="'midpoint' + index"
      :options="{ key: index }"
      @click="$emit('click-midpoint', midpoint)"
      @contextmenu="$emit('contextmenu-midpoint', midpoint)"
    >
      <l-icon
        :icon-anchor="[20, 20]"
        :icon-size="[40, 40]"
        className="leaflet-course-icon"
      >
        <div class="leaflet-course-arrow"></div>
      </l-icon>
    </l-marker>
  </l-layer-group>
</template>

<style lang="scss">
@import "~bulmaswatch/flatly/_variables.scss";

.routeTrace {
  stroke: $red;
  stroke-width: 7px;
  fill: none;
  opacity: 0.9;
}

.inactiveRoute {
  stroke: $blue;
  stroke-width: 5px;
  fill: none;
  opacity: 0.8;
}

.leaflet-course-arrow {
  transform: rotateZ(-90deg);
}
.leaflet-course-arrow:before {
  content: "➤";
}

.leaflet-course {
  font-family: "Lucida Console", Monaco, monospace;
  font-weight: bold;
  font-size: 22px;
  filter: saturate(0%);
}

.leaflet-course-icon {
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  text-align: center;
  vertical-align: middle;

  font-size: xx-large;
  text-shadow: 4px 4px 3px grey;
}

.leaflet-course-point:before {
  content: "⊙";
}

.leaflet-waypoint-popup {
  width: 60vw;
}
</style>

<script>
import {
  LLayerGroup,
  LIcon,
  LPopup,
  LPolyline,
  findRealParent,
} from "vue2-leaflet";

import Vue2LeafletRotatedMarker from "vue2-leaflet-rotatedmarker";

import LatLon from "geodesy/latlon-nvector-spherical.js";

import WaypointContent from "@/components/WaypointContent.vue";

export default {
  name: "LRouteLayerGroup",
  components: {
    LLayerGroup,
    "l-marker": Vue2LeafletRotatedMarker,
    LIcon,
    LPopup,
    LPolyline,
    WaypointContent,
  },
  props: {
    value: Array,
    active: Boolean,
  },
  mounted() {
    this.map = findRealParent(this.$parent, true).mapObject;
  },
  computed: {
    waypointsPosition() {
      return this.value.map((wp) => wp.latlng);
    },
    midpoints() {
      let res = [];
      this.value.reduce((previous, current, index) => {
        if (previous) {
          let prev = new LatLon(previous.latlng.lat, previous.latlng.lng);
          let cur = new LatLon(current.latlng.lat, current.latlng.lng);
          res.push({
            latlng: prev.midpointTo(cur),
            bearing: prev.initialBearingTo(cur),
            insertBefore: index,
          });
        }
        return current;
      }, null);
      return res;
    },
  },
};
</script>
