<template>
  <b-dropdown>
    <b-button slot="trigger">
      <b-icon icon="cog-outline" />
    </b-button>
    <b-dropdown-item custom>
      <b-switch
        v-bind:value="getLocation"
        @input="$emit('update:settings', { getLocation: $event })"
        >Use GNSS</b-switch
      >
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-switch
        v-bind:value="setView"
        :disabled="!getLocation"
        @input="$emit('update:settings', { setView: $event })"
        >Keep view centered</b-switch
      >
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-switch
        v-bind:value="fullScreen"
        @input="$emit('update:settings', { fullScreen: $event })"
        >Set Map Fullscreen</b-switch
      >
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-switch
        v-bind:value="zoomControl"
        @input="$emit('update:settings', { zoomControl: $event })"
        >Display zoom control</b-switch
      >
    </b-dropdown-item>
    <b-dropdown-item @click="$emit('delete-track')">
      <b-icon icon="map-marker-remove-outline" />Delete trace
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: "LMovingMapSettingsControl",
  props: {
    getLocation: Boolean,
    setView: Boolean,
    fullScreen: Boolean,
    zoomControl: Boolean,
    inFlight: Boolean
  }
};
</script>
