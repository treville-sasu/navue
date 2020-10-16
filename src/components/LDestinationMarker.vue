<template>
  <span v-if="origin && value">
    <l-layer-group>
      <l-marker :lat-lng="value.latlng" @contextmenu="$emit('input')">
        <l-icon class-name="leaflet-destination-icon">
          <div></div>
        </l-icon>
        <l-popup>
          <pre>
          {{ value }}
          {{ origin }}
          {{ route }}
        </pre
          >
        </l-popup>
      </l-marker>

      <l-polyline :lat-lngs="destinationVector" className="destinationVector" />
    </l-layer-group>
    <l-moving-map-destination-control v-model="route" position="bottomleft" />
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
import LatLon from "geodesy/latlon-ellipsoidal-vincenty.js";
// import "leaflet-textpath";

import {
  LLayerGroup,
  LMarker,
  LIcon,
  LPolyline,
  LPopup,
  findRealParent
} from "vue2-leaflet";

import LMovingMapDestinationControl from "@/components/LMovingMapDestinationControl.vue";

export default {
  name: "LDestinationMarker",
  components: {
    LLayerGroup,
    LMarker,
    LIcon,
    LPolyline,
    LPopup,
    LMovingMapDestinationControl
  },
  props: ["value", "origin"],
  mounted() {
    this.map = findRealParent(this.$parent, true).mapObject;
  },
  computed: {
    destinationVector() {
      return [this.origin.latlng, this.value.latlng];
    },
    route() {
      let origin = new LatLon(this.origin.latlng.lat, this.origin.latlng.lng);
      let destination = new LatLon(
        this.value.latlng.lat,
        this.value.latlng.lng
      );
      let distance = origin.distanceTo(destination);
      let heading = origin.initialBearingTo(destination);
      let ETE = distance / this.origin.speed;
      return {
        distance,
        heading,
        ETE,
        relative_bearing: heading - this.origin.heading,
        vertical_speed: (this.value.altitude - this.origin.altitude) / ETE
      };
    }
  }
};
</script>
