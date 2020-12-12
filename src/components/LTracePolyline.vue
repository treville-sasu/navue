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
      {{ bearing | asHeading | precision(0) | with('°') }} -
      {{ distance | to("NM") | precision(0) | with('NM') }}
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
import UnitSystem from "@/mixins/UnitSystem.js";

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
    bearing() {
      return this.origin.bearingTo(this.destination);
    },
    distance() {
      return this.origin.distanceTo(this.destination);
    }
  }
};
</script>
