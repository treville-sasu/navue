<template>
  <b-dropdown v-bind="$attrs">
    <template #trigger>
      <slot name="default">
        <b-button>
          <b-tooltip position="is-bottom" label="Locations">
            <b-icon icon="map-marker" />
          </b-tooltip>
        </b-button>
      </slot>
    </template>
    <b-dropdown-item custom>
      <b-autocomplete
        placeholder="location"
        :data="results"
        field="properties.display_name"
        @typing="searchLocation"
        :loading="isFetching"
        keep-first
        clear-on-select
        @select="$emit('show:poi', $event)"
        icon="map-search"
      />
      <!-- @select="
          (q, e) => {
            e.stopPropagation();
            this.onPOIFound(q);
          }
        " -->
    </b-dropdown-item>
    <b-dropdown-item :disabled="!canLocate" @click="locate">
      <b-icon icon="crosshairs-question" />
      Locate with GNSS
    </b-dropdown-item>
    <b-dropdown-item :disabled="!canLocate" custom>
      <b-switch
        v-bind:value="getLocation"
        @input="$emit('update:settings', { getLocation: $event })"
        >Locate with GNSS</b-switch
      >
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-field label="View mode">
        <b-radio-button
          v-bind:value="viewMode"
          @input="$emit('update:settings', { viewMode: $event })"
          native-value="north"
        >
          North up
        </b-radio-button>
        <b-radio-button
          v-bind:value="viewMode"
          @input="$emit('update:settings', { viewMode: $event })"
          native-value="heading"
        >
          Heading up
        </b-radio-button>
        <b-radio-button
          v-bind:value="viewMode"
          @input="$emit('update:settings', { viewMode: $event })"
          native-value="fpv"
        >
          Cockpit view
        </b-radio-button>
        <b-radio-button
          v-bind:value="viewMode"
          @input="$emit('update:settings', { viewMode: $event })"
          :native-value="false"
        >
          Free
        </b-radio-button>
      </b-field>
    </b-dropdown-item>
    <b-dropdown-item @click="$emit('update:camera', { pitch: 0, bearing: 0 })">
      <b-icon icon="refresh" />
      Reset view
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { Location } from "@/models/Location";

export default {
  name: "ViewManager",
  props: {
    getLocation: Boolean,
    centerView: Boolean,
    viewMode: [Boolean, String]
  },
  data() {
    return {
      canLocate: "geolocation" in navigator,
      isFetching: false,
      maxResults: 5,
      results: []
    };
  },
  methods: {
    locate() {
      navigator.geolocation.getCurrentPosition(
        this.onLocationFound,
        console.error,
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    },
    async searchLocation(str) {
      if (str.length >= 3) {
        this.isFetching = true;
        this.results = await this._queryNominatim(str);
        this.isFetching = false;
      }
    },
    onLocationFound(location) {
      let loc = Location.fromGeolocationPosition(location);
      loc.properties.display_name = `${loc.properties.accuracy} - ${loc.properties.altitude}`;
      this.$emit("show:poi", loc);
    },
    async _queryNominatim(q) {
      let url = new URL("https://nominatim.openstreetmap.org/search");
      url.search = new URLSearchParams({
        q,
        format: "geojson",
        limit: this.maxResults
        // viewbox=<x1>,<y1>,<x2>,<y2>
      });
      const raw = await fetch(url, { method: "GET" });
      const json = await raw.json();
      return json.features || [];
    }
  }
};
</script>
