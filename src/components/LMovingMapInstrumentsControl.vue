<template>
  <l-control v-bind="$attrs">
    <b-field grouped group-multiline>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-primary" size="is-medium">{{
            value.speed | asSpeed | precision(0)
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
            value.altitude | asAltitude | precision(-1)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">ft</b-tag>
        </b-taglist>
      </div>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-dark" size="is-medium">{{
            value.vario | asSpeed("ft/min") | precision(-1)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">ft/min</b-tag>
        </b-taglist>
      </div>
    </b-field>
  </l-control>
</template>

<script>
import { UnitSystem } from "@/mixins/apputils";
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
