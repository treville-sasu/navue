<template>
  <l-control v-bind="$attrs">
    <b-dropdown hoverable aria-role="list" position="is-bottom-right">
      <b-button slot="trigger" tag="a" icon-left="cog" class="leaflet-bar" />

      <b-dropdown-item aria-role="listitem" custom>
        <b-switch v-model="value.getLocation">Use GNSS</b-switch>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem" custom>
        <b-switch v-model="value.setView" :disabled="!value.getLocation"
          >Keep view centered</b-switch
        >
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem" custom>
        <b-switch v-model="value.wakeLock" :disabled="!wakeLockable"
          >Keep screen On</b-switch
        >
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem" custom>
        <b-switch v-model="value.recordLocation" :disabled="!value.getLocation"
          >Record track
        </b-switch>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem" custom>
        <b-button
          size="is-small"
          icon-right="delete"
          outlined
          @click="$emit('action', 'delete_track')"
          expanded
          >Delete track</b-button
        >
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem" custom>
        <b-switch v-model="value.allowWarning">Display warnings</b-switch>
      </b-dropdown-item>
    </b-dropdown>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";

export default {
  name: "LMovingMapsSettingsControl",
  components: {
    LControl,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          getLocation: true,
          setView: true,
          wakeLock: true,
          recordLocation: false,
          allowWarning: true,
        };
      },
    },
  },
  computed: {
    wakeLockable() {
      return "wakeLock" in navigator && document.visibilityState === "visible";
    },
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>
