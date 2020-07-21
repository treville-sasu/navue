<template>
  <l-control position="bottomleft">
    <b-dropdown hoverable aria-role="list" position="is-top-right">
      <b-button slot="trigger" icon-left="settings" />

      <b-dropdown-item aria-role="listitem" custom>
        <b-switch v-model="value.getLocation" @input="forwardEvent"
          >Use GPS</b-switch
        >
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem" custom>
        <b-switch
          v-model="value.setView"
          @input="forwardEvent"
          :disabled="!value.getLocation"
          >Keep view centered</b-switch
        >
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem" custom>
        <b-switch v-model="value.allowWarning" @input="forwardEvent"
          >Display warnings</b-switch
        >
      </b-dropdown-item>
    </b-dropdown>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";

export default {
  name: "MovingMapsSettings",
  components: {
    LControl
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          getLocation: true,
          setView: true,
          allowWarning: true,
          allowWarning: true
        };
      }
    }
  },
  methods: {
    forwardEvent() {
      this.$emit("input", this.value);
    }
  }
};
</script>
