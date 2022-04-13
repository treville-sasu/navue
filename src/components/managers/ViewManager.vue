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
      <b-icon icon="crosshairs-gps" />
      Locate with GNSS
    </b-dropdown-item>
    <b-dropdown-item v-if="follow" :disabled="!canLocate" :focusable="false">
      <b-field
        label="Follow mode"
        position="is-centered"
        grouped
        group-multiline
      >
        <b-radio-button
          :value="mode"
          native-value="north"
          size="is-small"
          @input="updateMode"
        >
          North
        </b-radio-button>
        <b-radio-button
          :value="mode"
          native-value="heading"
          size="is-small"
          @input="updateMode"
        >
          Heading
        </b-radio-button>
        <b-radio-button
          :value="mode"
          native-value="fpv"
          size="is-small"
          @input="updateMode"
        >
          Cockpit
        </b-radio-button>
        <b-radio-button
          :value="mode"
          native-value="free"
          size="is-small"
          @input="updateMode"
        >
          Free
        </b-radio-button>
        <b-radio-button
          :value="mode"
          native-value=""
          size="is-small"
          @input="updateMode"
        >
          No follow
        </b-radio-button>
      </b-field>
    </b-dropdown-item>
    <b-dropdown-item
      @click="
        $emit(
          'update:camera',
          { pitch: 0, bearing: 0 },
          {
            followMode: 'reset',
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
    follow: Boolean,
    mode: String,
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
    updateMode(e) {
      this.$emit("update:settings", { followMode: e });
    },
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
