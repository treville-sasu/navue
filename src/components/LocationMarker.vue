<template>
  <l-layer-group>
    <l-marker v-if="value.latlng" :lat-lng="value.latlng">
      <l-icon class-name="leaflet-diamond-icon">
        <div></div>
      </l-icon>
      <l-popup>
        <pre>
          {{ value }}
            </pre
        >
      </l-popup>
    </l-marker>
    <l-circle
      v-if="value.latlng && value.accuracy"
      :lat-lng="value.latlng"
      :radius="value.accuracy"
    />
    <l-polyline
      v-if="this.value.latlng && this.value.heading && this.value.speed"
      :lat-lngs="speedVector"
    />
  </l-layer-group>
</template>
<style>
/* Tracker icon */
.leaflet-diamond-icon {
  background: black;
  border: 2px solid #ffffff;
}

.leaflet-airplane-icon {
  transform: rotateZ(-90deg);
}
.leaflet-airplane-icon:before {
  content: "✈";
}

.leaflet-helicopter-icon:before {
  content: "✇";
  /*content: "⊛"; */
}

@keyframes revolution {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.leaflet-helicopter-icon {
  animation-name: revolution;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
.leaflet-helicopter-icon:hover {
  animation-play-state: paused;
}
</style>
<script>
import GeometryUtils from "leaflet-geometryutil";
import {
  LLayerGroup,
  LMarker,
  LIcon,
  LPolyline,
  LCircle,
  LPopup,
} from "vue2-leaflet";

export default {
  name: "LocationMarker",
  components: {
    LLayerGroup,
    LMarker,
    LIcon,
    LPolyline,
    LCircle,
    LPopup,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return { latlng: null, speed: null, heading: null, accuracy: null };
      },
    },
  },
  computed: {
    speedVector() {
      //show location 60 seconds in the futur
      return [
        this.value.latlng,
        GeometryUtils.destination(
          this.value.latlng,
          this.value.heading,
          this.value.speed * 60
        ),
      ];
    },
  },
};
</script>
