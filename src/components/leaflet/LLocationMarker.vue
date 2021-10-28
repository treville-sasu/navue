<template>
  <l-layer-group v-if="value && value.lngLat">
    <l-marker :lat-lng="value.lngLat">
      <l-icon class-name="leaflet-diamond-icon">
        <div></div>
      </l-icon>
    </l-marker>
    <l-circle
      v-if="value.properties.accuracy"
      :lat-lng="value.lngLat"
      :radius="Number(value.properties.accuracy)"
      className="accuracyCircle"
    />
    <template v-if="value.properties.heading && value.properties.speed">
      <l-polyline
        :lat-lngs="[value.lngLat, positionIn(2 ** delay).lngLat]"
        className="speedVector"
      />
      <l-marker
        :lat-lng="positionIn(2 ** n).lngLat"
        :key="n"
        v-for="n in delay"
      >
        <l-icon class-name="leaflet-number-icon" :iconSize="['1em', '1em']">
          <div>{{ 2 ** n }}</div>
        </l-icon>
      </l-marker>
    </template>
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
.leaflet-number-icon {
  line-height: 1.1em;
  padding: 0.1em;
  margin: -0.5em;
  background: #ffffff;
  border: 2px solid #000000;
  border-radius: 1em;
  text-align: center;
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
  methods: {
    positionIn(min) {
      return this.value.willBeIn(min * 60);
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        let bounds = this.value.bounds(
          this.value.properties.speed
            ? this.value.properties.speed * 2 ** this.delay * 60
            : this.value.properties.accuracy
        );
        this.$emit("update:bounds", bounds);
      }
    }
  }
};
</script>
