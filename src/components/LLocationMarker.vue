<template>
  <l-layer-group>
    <l-marker v-if="value.latlng" :lat-lng="value.latlng">
      <l-icon class-name="leaflet-diamond-icon">
        <div></div>
      </l-icon>
    </l-marker>
    <l-circle
      v-if="value.latlng && value.accuracy"
      :lat-lng="value.latlng"
      :radius="value.accuracy"
      className="accuracyCircle"
    />
    <l-polyline
      v-if="this.value.latlng && this.value.heading && this.value.speed"
      :lat-lngs="speedVector"
      className="speedVector"
    />
  </l-layer-group>
</template>

<style lang="scss">
@import "~bulmaswatch/flatly/_variables.scss";

.speedVector {
  stroke: $blue;
  stroke-width: 0.5em;
}
.accuracyCircle {
  stroke: $blue;
}
/* Tracker icon */
.leaflet-diamond-icon {
  background: black;
  border: 2px solid #ffffff;
}
</style>

<script>
import { LLayerGroup, LMarker, LIcon, LPolyline, LCircle } from "vue2-leaflet";

export default {
  name: "LLocationMarker",
  components: {
    LLayerGroup,
    LMarker,
    LIcon,
    LPolyline,
    LCircle
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return { latlng: null, speed: null, heading: null, accuracy: null };
      }
    },
    delay: {
      type: Number,
      default: () => {
        return 60;
      }
    }
  },
  computed: {
    speedVector() {
      return [
        this.value.latlng,
        this.value.destinationPoint(
          this.value.speed * this.delay,
          this.value.heading
        )
      ];
    }
  }
};
</script>
