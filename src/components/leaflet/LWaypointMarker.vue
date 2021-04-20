<template>
  <l-marker v-bind="$attrs" v-on="$listeners" :lat-lng.sync="value.latlng">
    <l-icon
      :icon-anchor="[20, 16]"
      :icon-size="[40, 40]"
      className="route-icon"
    >
      <div class="leaflet-waypoint-point"></div>
    </l-icon>
    <l-popup
      v-if="$attrs.draggable"
      :options="{
        closeButton: true,
        className: 'leaflet-waypoint-popup',
        maxWidth: '60vw'
      }"
    >
      <WaypointContent v-model="value" />
    </l-popup>
    <l-tooltip
      v-else-if="value.name || value.altitude"
      :options="{
        className: 'waypointLabel',
        permanent: true,
        sticky: true
      }"
    >
      {{ value.name }}
      {{ value.name && value.altitude ? "|" : "" }}
      {{ value.altitude && value.altitude.toString() }}
    </l-tooltip>
  </l-marker>
</template>

<style lang="scss">
@import "~bulmaswatch/flatly/_variables.scss";
.route-icon {
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  text-align: center;
  vertical-align: middle;

  font-size: xx-large;
  text-shadow: 4px 4px 3px grey;
}

.waypointLabel {
  padding: 0.3em;
  color: white;
  background-color: $primary;
  border: none;
}

.waypointLabel.leaflet-tooltip-right::before {
  border-right-color: $primary;
}
.waypointLabel.leaflet-tooltip-left::before {
  border-left-color: $primary;
}

.leaflet-waypoint-point:before {
  content: "⊙";
}

.leaflet-waypoint-popup {
  width: 60vw;
}
</style>

<script>
import { LMarker, LIcon, LPopup, LTooltip } from "vue2-leaflet";
import WaypointContent from "@/components/WaypointContent.vue";

export default {
  name: "LWaypointMarker",
  components: {
    LMarker,
    LIcon,
    LPopup,
    LTooltip,
    WaypointContent
  },
  props: ["value"]
};
</script>
