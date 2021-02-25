<template>
  <l-control v-bind="$attrs">
    <div class="buttons has-addons">
      <b-button @click="$emit('update:settings', { navigationSelect: true })">
        <b-icon icon="map-marker-path" />
      </b-button>
      <b-button tag="router-link" to="NavLog">
        <b-icon icon="clipboard-list-outline" />
      </b-button>
      <b-button tag="router-link" to="Checklists">
        <b-icon icon="list-status" />
      </b-button>
    </div>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";

export default {
  name: "LMovingMapToolboxControl",
  components: {
    LControl
  }
};
</script>
