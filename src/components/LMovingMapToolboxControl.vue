<template>
  <l-control v-bind="$attrs">
    <div class="buttons">
      <BIconButton
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
  }
};
</script>
