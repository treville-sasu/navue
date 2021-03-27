<template>
  <l-control v-bind="$attrs">
    <b-taglist>
      <b-tag type="is-primary" size="is-medium">{{
        speed | as("kt") | toString(0)
      }}</b-tag>
      <b-tag type="is-success" size="is-medium">{{
        heading | toString(-1)
      }}</b-tag>
      <b-tag type="is-info" size="is-medium">{{
        altitude | as("ft") | toString(-1)
      }}</b-tag>
      <b-tag type="is-dark" size="is-medium">{{
        verticalSpeed | as("ft/min") | toString(-1)
      }}</b-tag>
    </b-taglist>
  </l-control>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem.js";
import { LControl } from "vue2-leaflet";

export default {
  name: "LMovingMapInstrumentsControl",
  components: {
    LControl
  },
  props: ["altitude", "heading", "speed", "verticalSpeed"],
  mixins: [UnitSystem]
};
</script>
