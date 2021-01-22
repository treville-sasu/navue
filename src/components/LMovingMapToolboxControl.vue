<template>
  <l-control v-bind="$attrs">
    <div class="buttons">
      <BIconButton
        v-if="!inFlight"
        @click="$emit('update:settings', { inFlight: true })"
        tooltip="Start"
        icon="airplane-takeoff"
      />
      <BIconButton
        v-else
        @click="$emit('update:settings', { inFlight: false })"
        tooltip="Stop"
        :icon="{ type: 'is-danger', icon: 'airplane-landing' }"
      />
      <BIconButton
        v-if="!inFlight"
        @click="$emit('update:settings', { navigationSelect: true })"
        tooltip="Select a navigation"
        icon="map-marker-path"
      />
    </div>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";
import BIconButton from "@/components/BIconButton.vue";

export default {
  name: "LMovingMapToolboxControl",
  components: {
    LControl,
    BIconButton
  },
  props: { inFlight: Boolean }
};
</script>
