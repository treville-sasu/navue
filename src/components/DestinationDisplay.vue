<template>
  <b-taglist>
    <b-tag type="is-primary" size="is-medium">{{ distance | as("NM") }}</b-tag>
    <b-tag type="is-success" size="is-medium">{{ heading }}</b-tag>
    <b-tag type="is-info" size="is-medium">{{ to.altitude | as("ft") }}</b-tag>
    <b-tag type="is-light" size="is-medium">{{
      vertical_speed | as("m/s")
    }}</b-tag>

    <b-tag type="is-dark" size="is-medium">ETE {{ ETE | asDuration }}</b-tag>
  </b-taglist>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem.js";

import { Speed } from "@/models/Quantities.js";

export default {
  name: "DestinationDisplay",
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
    vertical_speed() {
      return new Speed(
        (this.to.altitude - this.from.altitude) / this.ETE,
        "m/s"
      );
    }
  }
};
</script>
