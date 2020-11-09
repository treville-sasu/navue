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
          <b-switch v-model="value.wakeLock" :disabled="!wakeLockable"
            >Keep screen On</b-switch
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
        <b-dropdown-item>
          <b-switch v-model="value.allowWarning">Display warnings</b-switch>
        </b-dropdown-item>
      </b-dropdown>
      <template v-if="!value.inFlight">
        <p class="control">
          <button
            class="button"
            @click="$store.commit('navigationSelect', true)"
          >
            <b-tooltip label="Select a navigation">
              <b-icon icon="map-marker-path" />
            </b-tooltip>
          </button>
        </p>
        <p class="control">
          <button class="button" @click="$store.commit('aircraftSelect', true)">
            <b-tooltip label="Select an aircraft">
              <b-icon icon="airplane" />
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
        <p class="control">
          <button
            class="button"
            @click="$store.commit('traceSelect', true)"
            disabled
          >
            <b-tooltip label="Save trace">
              <b-icon icon="map-marker-plus-outline" />
            </b-tooltip>
          </button>
        </p>
      </template>

      <template v-else>
        <p class="control">
          <button class="button" @click="value.inFlight = false">
            <b-tooltip label="Stop">
              <b-icon type="is-danger" icon="airplane-landing" />
            </b-tooltip>
          </button>
        </p>
        <p class="control">
          <button class="button" disabled>
            <b-tooltip label="Checklist">
              <b-icon icon="clipboard-list-outline" />
            </b-tooltip>
          </button>
        </p>
      </template>
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
          wakeLock: true,
          inFlight: false,
          allowWarning: true
        };
      }
    }
  },
  computed: {
    wakeLockable() {
      return "wakeLock" in navigator && document.visibilityState === "visible";
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
