<template>
  <l-control v-bind="$attrs">
    <b-field grouped group-multiline>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-primary" size="is-medium">{{
            value.speed | to("kt") | precision(0)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">kt</b-tag>
        </b-taglist>
      </div>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-primary" size="is-medium">{{
            value.heading | asHeading | precision(0)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">°</b-tag>
        </b-taglist>
      </div>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-info" size="is-medium">{{
            value.altitude | to("ft") | precision(-1)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">ft</b-tag>
        </b-taglist>
      </div>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-dark" size="is-medium">{{
            value.vario | to("ft/min") | precision(-1)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">ft/min</b-tag>
        </b-taglist>
      </div>
    </b-field>
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
  props: {
    value: {
      type: Object,
      default: () => {
        return { speed: null, altitude: null, heading: null, vario: null };
      }
    }
  },
  mixins: [UnitSystem]
};
</script>
