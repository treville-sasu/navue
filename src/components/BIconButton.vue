<template>
  <b-button v-on="$listeners">
    <b-tooltip v-if="tooltip" v-bind="tooltipOptions">
      <b-icon v-bind="iconOptions" />
    </b-tooltip>
    <b-icon v-else v-bind="iconOptions" />
  </b-button>
</template>

<script>
export default {
  name: "BIconButton",
  props: {
    tooltip: [Object, String],
    icon: [Object, String]
  },
  computed: {
    tooltipOptions() {
      return typeof this.tooltip == "string"
        ? { label: this.tooltip }
        : this.tooltip;
    },
    iconOptions() {
      return typeof this.icon == "string" ? { icon: this.icon } : this.icon;
    }
  }
};
</script>
