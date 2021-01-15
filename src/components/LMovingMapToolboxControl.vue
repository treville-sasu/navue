<template>
  <l-control v-bind="$attrs">
    <b-field>
      <b-dropdown position="is-top-right">
        <p class="control" slot="trigger">
          <button class="button">
            <b-tooltip label="Settings">
              <b-icon icon="cog-outline" />
            </b-tooltip>
          </button>
        </p>
        <b-dropdown-item>
          <b-switch v-model="value.getLocation">Use GNSS</b-switch>
        </b-dropdown-item>
        <b-dropdown-item>
          <b-switch v-model="value.setView" :disabled="!value.getLocation"
            >Keep view centered</b-switch
          >
        </b-dropdown-item>
        <b-dropdown-item>
          <b-switch v-model="value.zoomControl">Display zoom control</b-switch>
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
      <template v-if="!value.inFlight">
        <p class="control">
          <button class="button" @click="$emit('open-navigation')">
            <b-tooltip label="Select a navigation">
              <b-icon icon="map-marker-path" />
            </b-tooltip>
          </button>
        </p>
        <p class="control">
          <button class="button" @click="value.inFlight = true">
            <b-tooltip label="Start">
              <b-icon icon="airplane-takeoff" />
            </b-tooltip>
          </button>
        </p>
      </template>

      <p class="control" v-else>
        <button class="button" @click="value.inFlight = false">
          <b-tooltip label="Stop">
            <b-icon type="is-danger" icon="airplane-landing" />
          </b-tooltip>
        </button>
      </p>
    </b-field>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";

export default {
  name: "LMovingMapToolboxControl",
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
          zoomControl: false,
          inFlight: false
        };
      }
    }
  },
  computed: {
    aircraft() {
      return this.$store.state.currentAircraft;
    },
    navigation() {
      return this.$store.state.currentNavigation;
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>
