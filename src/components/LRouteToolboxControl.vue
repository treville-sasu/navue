<template>
  <l-control v-bind="$attrs">
    <b-field>
      <b-radio-button v-model="tool" native-value="select">
        <b-tooltip label="open or save">
          <b-icon icon="cloud-sync-outline" />
        </b-tooltip>
      </b-radio-button>
      <b-radio-button v-model="tool" native-value="route">
        <b-tooltip label="new route">
          <b-icon icon="map-plus" />
        </b-tooltip>
      </b-radio-button>

      <b-radio-button v-model="tool" native-value="getinfo">
        <b-tooltip label="Display info on this position">
          <b-icon icon="crosshairs-question" />
        </b-tooltip>
      </b-radio-button>

      <b-radio-button v-model="tool" native-value="clear">
        <b-tooltip label="Clear current route">
          <b-icon icon="eraser" />
        </b-tooltip>
      </b-radio-button>
    </b-field>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";

export default {
  name: "LRouteToolboxControl",
  components: {
    LControl,
  },
  props: ["value", "navigationName"],
  data() {
    return {
      displayNaviationInput: null,
    };
  },
  computed: {
    tool: {
      get: function() {
        return this.value;
      },
      set: function(newVal) {
        this.$emit("input", newVal);
      },
    },
  },
};
</script>
