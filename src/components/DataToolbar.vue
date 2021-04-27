<template>
  <b-field>
    <NavigationManager position="is-bottom-right">
      <template #default>
        <b-button>
          <b-tooltip label="Open Navigation">
            <b-icon icon="map-marker-path" />
          </b-tooltip>
        </b-button>
      </template>
      <template #header="{ selected }">
        {{ selected.name }}
      </template>
    </NavigationManager>
    <b-button disabled>
      <b-tooltip label="Save Trace">
        <b-icon icon="record-rec" />
      </b-tooltip>
    </b-button>
  </b-field>
</template>

<script>
import NavigationManager from "@/components/NavigationManager";

export default {
  name: "DataToolbar",
  components: {
    NavigationManager
  }
};
</script>
