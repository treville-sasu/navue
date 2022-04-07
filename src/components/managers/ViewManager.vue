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
        icon="map-search"
        placeholder="location"
        :data="results"
        field="properties.display_name"
        :loading="isFetching"
        clear-on-select
        keep-first
        @typing="searchLocation"
        @select="$emit('show:poi', $event)"
      />
    </b-dropdown-item>
    <b-dropdown-item :disabled="!canLocate" @click="locate">
      <b-icon icon="crosshairs-question" />
      Locate with GNSS
    </b-dropdown-item>
    <b-dropdown-item :disabled="!canLocate" custom>
      <b-switch
        :value="getLocation"
        @input="$emit('update:settings', { getLocation: $event })"
        >Locate with GNSS</b-switch
      >
    </b-dropdown-item>
    <b-dropdown-item custom>
      <b-field label="View mode">
        <b-radio-button
          :value="viewMode"
          native-value="north"
          @input="$emit('update:settings', { viewMode: $event })"
        >
          North up
        </b-radio-button>
        <b-radio-button
          :value="viewMode"
          native-value="heading"
          @input="$emit('update:settings', { viewMode: $event })"
        >
          Heading up
        </b-radio-button>
        <b-radio-button
          :value="viewMode"
          native-value="fpv"
          @input="$emit('update:settings', { viewMode: $event })"
        >
          Cockpit view
        </b-radio-button>
        <b-radio-button
          :value="viewMode"
          :native-value="false"
          @input="$emit('update:settings', { viewMode: $event })"
        >
          Free
        </b-radio-button>
      </b-field>
    </b-dropdown-item>
    <b-dropdown-item
      @click="
        $emit(
          'update:camera',
          { pitch: 0, bearing: 0 },
          {
            trigger: 'viewMode',
          }
        )
      "
    >
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
    viewMode: [Boolean, String],
  },
  data() {
    return {
      canLocate: "geolocation" in navigator,
      isFetching: false,
      maxResults: 5,
      results: [],
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
        limit: this.maxResults,
      });
      const raw = await fetch(url.toString(), { method: "GET" });
      const json = await raw.json();
      return json.features || [];
    },
  },
};
</script>
