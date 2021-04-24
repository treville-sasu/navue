<template>
  <l-control v-bind="$attrs">
    <div class="buttons has-addons">
      <NavigationManager position="is-top-right">
        <template #default>
          <b-button>
            <!-- <b-tooltip label="open or save"> -->
            <b-icon icon="map-marker-path" />
            <!-- </b-tooltip> -->
          </b-button>
        </template>
        <template #header="{ selected }">
          {{ selected.name }}
        </template>
      </NavigationManager>
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
import NavigationManager from "@/components/NavigationManager";

export default {
  name: "LMovingMapToolboxControl",
  components: {
    LControl,
    NavigationManager
  }
};
</script>
