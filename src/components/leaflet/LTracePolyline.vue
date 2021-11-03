<template>
  <l-polyline
    v-bind="$attrs"
    v-on="$listeners"
    :lat-lngs="[origin.lngLat, destination.lngLat]"
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
      {{ bearing | as("°", 3) }} |
      {{ distance | as("NM", 3) }}
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
  background-color: white;
  color: $primary;
  border: 0.1em solid $primary;
}

.inactiveRoute {
  stroke: $blue;
  stroke-width: 5px;
  fill: none;
  opacity: 0.8;
}
</style>

<script>
import { LPolyline, LTooltip } from "vue2-leaflet";
import UnitSystem from "@/mixins/UnitSystem.js";

export default {
  name: "LTracePolyline",
  mixins: [UnitSystem],
  components: {
    LPolyline,
    LTooltip
  },
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
