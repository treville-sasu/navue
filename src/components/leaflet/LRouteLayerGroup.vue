<template>
  <l-layer-group>
    <LWaypointMarker
      v-for="(waypoint, wp_id) in points"
      :key="wp_id"
      :value.sync="points[wp_id]"
      :draggable="active"
      @click="$emit('click-waypoint', wp_id)"
      @contextmenu="$emit('contextmenu-waypoint', wp_id)"
    />
    <LTracePolyline
      v-for="(leg, id) in legs"
      :key="'leg' + id"
      :active="active"
      :origin="leg.previous"
      :destination="leg.current"
      :className="active ? 'routeTrace' : 'inactiveRoute'"
      @contextmenu="$emit('contextmenu-trace')"
      @click="
        $emit('click-trace', {
          latlng: $event.latlng,
          insertBefore: leg.insertBefore
        })
      "
    />
  </l-layer-group>
</template>

<script>
import { LLayerGroup, findRealParent } from "vue2-leaflet";
import LWaypointMarker from "@/components/leaflet/LWaypointMarker";
import LTracePolyline from "@/components/leaflet/LTracePolyline";

export default {
  name: "LRouteLayerGroup",
  components: {
    LLayerGroup,
    LWaypointMarker,
    LTracePolyline
  },
  props: {
    value: Object,
    active: Boolean
  },
  mounted() {
    this.map = findRealParent(this.$parent, true).mapObject;
  },
  computed: {
    points() {
      return this.value.features;
    },
    legs() {
      let legsArray = [];
      this.value.pairs((previous, current, insertBefore) => {
        legsArray.push({
          previous,
          current,
          insertBefore
        });
      });
      return legsArray;
    }
  }
};
</script>
