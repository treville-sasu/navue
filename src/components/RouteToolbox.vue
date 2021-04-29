<template>
  <b-field>
    <b-radio-button v-model="tool" native-value="route">
      <b-tooltip label="new route" v-bind="tooltip">
        <b-icon icon="map-plus" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button v-model="tool" native-value="getinfo">
      <b-tooltip label="Display info on this position" v-bind="tooltip">
        <b-icon icon="crosshairs-question" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>

    <b-radio-button v-model="tool" native-value="clear">
      <b-tooltip label="Clear current route" v-bind="tooltip">
        <b-icon icon="eraser" v-bind="icon" />
      </b-tooltip>
    </b-radio-button>
  </b-field>
</template>

<script>
export default {
  name: "RouteToolbox",
  props: { value: String, tooltip: Object, icon: Object },
  computed: {
    tool: {
      get: function() {
        return this.value;
      },
      set: function(newVal) {
        this.$emit("input", newVal);
      }
    }
  }
};
</script>
