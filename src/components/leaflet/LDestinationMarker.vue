<template>
  <span v-if="from && to">
    <l-layer-group>
      <l-marker :lat-lng="to.lngLat" @contextmenu="$emit('update')">
        <l-icon class-name="leaflet-destination-icon">
          <div></div>
        </l-icon>
      </l-marker>

      <l-polyline
        :lat-lngs="[from.lngLat, to.lngLat]"
        className="destinationVector"
      >
        <!-- {{ bearing }} | {{ ETE | asDuration(1000) }} |
          {{ distance | as("NM", 3) }} -->
      </l-polyline>
    </l-layer-group>
  </span>
</template>

<style lang="scss">
@import "~bulmaswatch/flatly/_variables.scss";

.destinationVector {
  stroke: $orange;
  fill: none;
  stroke-width: 5;
}

.leaflet-destination-icon {
  background: $orange;
  border: 2px solid #ffffff;
}
</style>

<script>
import { LLayerGroup, LMarker, LIcon, LPolyline } from "vue2-leaflet";

import UnitSystem from "@/mixins/UnitSystem.js";

// import { Speed } from "@/models/Quantities.js";

export default {
  name: "LDestinationMarker",
  components: {
    LLayerGroup,
    LMarker,
    LIcon,
    LPolyline
  },
  props: {
    from: Object,
    to: Object
  },
  mixins: [UnitSystem],
  computed: {
    destinationVector() {
      return [this.from.lngLat, this.to.lngLat];
    }
    // distance() {
    //   return this.from.distanceTo(this.to, { precision: 3 });
    // },
    // ETE() {
    //   return this.distance / this.from.speed;
    // },
    // bearing() {
    //   return this.from.bearingTo(this.to, { precision: 3 });
    // },
    // vertical_speed() {
    //   return new Speed(
    //     (this.to.altitude - this.from.altitude) / this.ETE,
    //     "m/s"
    //   );
    // }
  }
};
</script>
