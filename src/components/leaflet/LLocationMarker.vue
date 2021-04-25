<template>
  <l-layer-group v-if="this.value.latlng">
    <l-marker :lat-lng="value.latlng">
      <l-icon class-name="leaflet-diamond-icon">
        <div></div>
      </l-icon>
    </l-marker>
    <l-circle
      v-if="value.accuracy"
      :lat-lng="value.latlng"
      :radius="value.accuracy"
      className="accuracyCircle"
    />
    <l-polyline
      v-if="value.heading && value.speed"
      :lat-lngs="speedVector"
      className="speedVector"
    />

    <l-marker :lat-lng="nMinutesPosition(n)" :key="n" v-for="n in delay">
      <l-icon :class-name="`mdi mdi-numeric-${n}-circle mdi-18px`">
        <div></div>
      </l-icon>
    </l-marker>
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
        return 3;
      }
    }
  },
  computed: {
    speedVector() {
      return [this.value.latlng, this.nMinutesPosition(this.delay)];
    }
  },
  methods: {
    nMinutesPosition(n) {
      return this.value.positionInSeconds(n * 60).latlng;
    }
  }
};
</script>
