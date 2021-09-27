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
        field="label"
        @typing="searchLocation"
        :loading="isFetching"
        keep-first
        clear-on-select
        @select="
          ({ x, y }, e) => {
            e.stopPropagation();
            this.onLocationFound({ latitude: y, longitude: x });
          }
        "
        icon="map-search"
      />
    </b-dropdown-item>
    <b-dropdown-item :disabled="!canLocate" @click="locate">
      <b-icon icon="crosshairs-gps" />
      Locate with GNSS
    </b-dropdown-item>
    <b-dropdown-item>
      <b-icon icon="crosshairs" />
      Center view
    </b-dropdown-item>
    <b-dropdown-item>
      <b-icon icon="compass" />
      Put north on top
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { OpenStreetMapProvider } from "leaflet-geosearch";

export default {
  name: "ViewManager",
  data() {
    return {
      canLocate: "geolocation" in navigator,
      isFetching: false,
      results: [],
      geosearch: new OpenStreetMapProvider(),
      parentContainer: undefined
    };
  },
  inject: ["getMap"],
  methods: {
    locate() {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => this.onLocationFound(coords),
        console.error,
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    },
    async searchLocation(str) {
      if (str.length >= 3) {
        this.isFetching = true;
        this.results = await this.geosearch.search({ query: str });
        this.isFetching = false;
      }
    },
    onLocationFound({ latitude, longitude }) {
      console.debug([latitude, longitude]);
      this.$emit("update:center", [latitude, longitude]);
      this.getMap().flyTo([latitude, longitude]);
    }
  }
};
</script>
