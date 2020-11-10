<template>
  <l-polyline
    v-bind="$attrs"
    v-on="$listeners"
    :lat-lngs="[origin.latlng, destination.latlng]"
  >
    <l-tooltip
      v-if="!active"
      :options="{
        className: 'routeLabel',
        direction: 'center',
        permanent: true,
        sticky: true
      }"
    >
      {{ bearing | asHeading | precision(0) }}° -
      {{ distance | asDistance("NM") | precision(0) }}NM
    </l-tooltip>
  </l-polyline>
</template>

<style lang="scss">
@import "~bulmaswatch/flatly/_variables.scss";

.routeTrace {
  stroke: $red;
  stroke-width: 7px;
  fill: none;
  opacity: 0.9;
}

.routeLabel {
  padding: 0.3em;
  color: white;
  background-color: $primary;
  border: none;
}

.inactiveRoute {
  stroke: $blue;
  stroke-width: 5px;
  fill: none;
  opacity: 0.8;
}
</style>

<script>
//TODO : implement geodesic lines

import { LPolyline, LTooltip } from "vue2-leaflet";
import LatLon from "geodesy/latlon-nvector-spherical.js";
import { UnitSystem } from "@/mixins/apputils";

export default {
  name: "LTracePolyline",
  components: {
    LPolyline,
    LTooltip
  },
  mixins: [UnitSystem],
  props: {
    active: Boolean,
    origin: Object,
    destination: Object
  },
  computed: {
    originCoord() {
      return new LatLon(this.origin.latlng.lat, this.origin.latlng.lng);
    },
    destinationCoord() {
      return new LatLon(
        this.destination.latlng.lat,
        this.destination.latlng.lng
      );
    },
    bearing() {
      return this.originCoord.initialBearingTo(this.destinationCoord);
    },
    distance() {
      return this.originCoord.distanceTo(this.destinationCoord);
    }
  }
};
</script>
