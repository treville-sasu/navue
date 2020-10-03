<template>
  <l-control v-bind="$attrs">
    <b-field grouped group-multiline>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-success" size="is-medium">{{
            value.distance | asDistance("NM") | precision(0)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">NM</b-tag>
        </b-taglist>
      </div>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-info" size="is-medium">{{
            value.heading | asHeading | precision(0)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">°</b-tag>
        </b-taglist>
      </div>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-warning" size="is-medium">{{
            value.altitude | asAltitude | precision(-1)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">ft</b-tag>
          <b-tag type="is-danger" size="is-medium">{{
            value.vertical_speed | asSpeed("ft/min") | precision(-1)
          }}</b-tag>
          <b-tag type="is-light" size="is-medium">ft/min</b-tag>
        </b-taglist>
      </div>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-light" size="is-medium">ETE</b-tag>
          <b-tag type="is-primary" size="is-medium">{{
            value.ETE | asDuration
          }}</b-tag>
        </b-taglist>
      </div>
    </b-field>
  </l-control>
</template>

<script>
import { UnitSystem } from "@/mixins/apputils";
import { LControl } from "vue2-leaflet";

export default {
  name: "LMovingMapDestinationControl",
  components: {
    LControl
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          distance: null,
          heading: null,
          altitude: null,
          vario: null,
          ETE: null
        };
      }
    }
  },
  mixins: [UnitSystem]
};
</script>
