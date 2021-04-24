<template>
  <l-control v-bind="$attrs">
    <b-field>
      <NavigationManager position="is-top-right" edit>
        <template #default>
          <b-button>
            <b-tooltip label="open or save">
              <b-icon icon="map-marker-path" />
            </b-tooltip>
          </b-button>
        </template>
        <template #header="{ selected }">
          <b-input
            v-model="selected.name"
            placeholder="name"
            :lazy="true"
            type="is-warning"
          />
        </template>
      </NavigationManager>
      <!-- <b-button tag="router-link" to="NavLog">
        <b-icon icon="clipboard-list-outline" />
      </b-button> -->
      <b-radio-button v-model="tool" native-value="route">
        <b-tooltip label="new route">
          <b-icon icon="map-plus" />
        </b-tooltip>
      </b-radio-button>

      <b-radio-button v-model="tool" native-value="getinfo">
        <b-tooltip label="Display info on this position">
          <b-icon icon="crosshairs-question" />
        </b-tooltip>
      </b-radio-button>

      <b-radio-button v-model="tool" native-value="clear">
        <b-tooltip label="Clear current route">
          <b-icon icon="eraser" />
        </b-tooltip>
      </b-radio-button>
    </b-field>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";
import NavigationManager from "@/components/NavigationManager";

export default {
  name: "LRouteToolboxControl",
  components: {
    LControl,
    NavigationManager
  },
  props: { value: String },
  computed: {
    tool: {
      get: function() {
        return this.value;
      },
      set: function(newVal) {
        this.$emit("input", newVal);
      }
    }
  }
};
</script>
