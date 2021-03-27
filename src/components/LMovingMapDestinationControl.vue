<template>
  <l-control v-bind="$attrs">
    <b-taglist>
      <b-tag type="is-primary" size="is-medium">{{
        distance | as("NM") | toString(0)
      }}</b-tag>
      <b-tag type="is-success" size="is-medium">{{
        heading | toString(0)
      }}</b-tag>
      <b-tag type="is-info" size="is-medium">{{
        to.altitude | toString(-1)
      }}</b-tag>
      <b-tag type="is-light" size="is-medium">{{
        vertical_speed | as("ft/min") | toString(-1)
      }}</b-tag>

      <b-tag type="is-dark" size="is-medium">ETE {{ ETE | asDuration }}</b-tag>
    </b-taglist>
  </l-control>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem.js";
import { LControl } from "vue2-leaflet";

export default {
  name: "LMovingMapDestinationControl",
  components: {
    LControl
  },
  props: {
    from: Object,
    to: Object
  },
  mixins: [UnitSystem],
  computed: {
    distance() {
      return this.from.distanceTo(this.to);
    },
    ETE() {
      return this.distance / this.from.speed;
    },
    heading() {
      return this.from.bearingTo(this.to);
    },
    relative_bearing() {
      return this.heading - this.from.heading;
    },
    vertical_speed() {
      return (this.to.altitude - this.from.altitude) / this.ETE;
    }
  }
};
</script>
