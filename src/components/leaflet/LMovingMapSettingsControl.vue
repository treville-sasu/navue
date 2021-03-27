<template>
  <l-control v-bind="$attrs">
    <b-dropdown>
      <b-button slot="trigger">
        <b-icon icon="cog-outline" />
      </b-button>
      <b-dropdown-item>
        <b-switch
          v-bind:value="getLocation"
          @input="$emit('update:settings', { getLocation: $event })"
          >Use GNSS</b-switch
        >
      </b-dropdown-item>
      <b-dropdown-item>
        <b-switch
          v-bind:value="setView"
          :disabled="!getLocation"
          @input="$emit('update:settings', { setView: $event })"
          >Keep view centered</b-switch
        >
      </b-dropdown-item>
      <b-dropdown-item>
        <b-switch
          v-bind:value="fullScreen"
          @input="$emit('update:settings', { fullScreen: $event })"
          >Set Map Fullscreen</b-switch
        >
      </b-dropdown-item>
      <b-dropdown-item>
        <b-switch
          v-bind:value="zoomControl"
          @input="$emit('update:settings', { zoomControl: $event })"
          >Display zoom control</b-switch
        >
      </b-dropdown-item>
      <b-dropdown-item>
        <b-button
          size="is-small"
          icon-right="map-marker-remove-outline"
          outlined
          @click="$emit('delete-track')"
          expanded
          >Delete trace</b-button
        >
      </b-dropdown-item>
    </b-dropdown>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";

export default {
  name: "LMovingMapSettingsControl",
  components: {
    LControl
  },
  props: {
    getLocation: Boolean,
    setView: Boolean,
    fullScreen: Boolean,
    zoomControl: Boolean,
    inFlight: Boolean
  }
};
</script>
