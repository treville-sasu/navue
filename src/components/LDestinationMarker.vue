<template>
  <span v-if="origin && value">
    <l-layer-group>
      <l-marker :lat-lng="value.latlng" @contextmenu="$emit('input')">
        <l-icon class-name="leaflet-destination-icon">
          <div></div>
        </l-icon>
      </l-marker>

      <l-polyline :lat-lngs="destinationVector" className="destinationVector" />
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
import {
  LLayerGroup,
  LMarker,
  LIcon,
  LPolyline,
  findRealParent
} from "vue2-leaflet";

export default {
  name: "LDestinationMarker",
  components: {
    LLayerGroup,
    LMarker,
    LIcon,
    LPolyline
  },
  props: ["value", "origin"],
  mounted() {
    this.map = findRealParent(this.$parent, true).mapObject;
  },
  computed: {
    destinationVector() {
      return [this.origin.latlng, this.value.latlng];
    }
  }
};
</script>
