<template>
  <l-layer-group>
    <LWaypointMarker
      v-for="(waypoint, wp_id) in value"
      :key="wp_id"
      v-model="value[wp_id]"
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
          insertBefore: leg.insertBefore,
        })
      "
    />
  </l-layer-group>
</template>

<script>
//TODO : implement geodesic lines and enable Midpoints.

import { LLayerGroup, findRealParent } from "vue2-leaflet";
import LWaypointMarker from "@/components/LWaypointMarker.vue";
import LTracePolyline from "@/components/LTracePolyline.vue";

export default {
  name: "LRouteLayerGroup",
  components: {
    LLayerGroup,
    LWaypointMarker,
    LTracePolyline
  },
  props: {
    value: Array,
    active: Boolean
  },
  mounted() {
    this.map = findRealParent(this.$parent, true).mapObject;
  },
  computed: {
    traceCoord() {
      return this.value.map(wp => wp.latlng);
    },
    legs() {
      let legsArray = [];
      this.value.reduce((previous, current, insertBefore) => {
        if (previous) {
          legsArray.push({
            previous,
            current,
            insertBefore
          });
        }
        return current;
      }, null);
      return legsArray;
    }
  }
};
</script>
