<template>
  <section class="mpx-map-wrapper">
    <mx-map v-bind="mapSettings.base" @load="map = $event.target">
      <mx-navigation-control visualizePitch />
      <mx-scale-control unit="nautical" />
      <mx-i-control position="top-left">
        <DataToolbox
          class="is-stackable"
          :flight="{
            edit: true
          }"
          :dropdown="{
            position: 'is-bottom-right',
            triggers: ['click', 'hover']
          }"
        />
      </mx-i-control>

      <mx-i-control position="bottom-right" v-if="currentBranch">
        <b-button
          type="is-light"
          :icon-right="
            chartOpened ? 'arrow-bottom-right-thick' : 'arrow-top-left-thick'
          "
          @click="chartOpened = !chartOpened"
        />
        <ProfileChart
          :geojson="currentBranch"
          class="profil-chart pl-5"
          v-if="chartOpened"
        />
      </mx-i-control>

      <mx-layer v-bind="mapSettings.sia" />
      <mx-layer v-bind="mapSettings.swisstopo" />

      <mx-source
        v-if="flight"
        type="geojson"
        id="flight"
        generateId
        :data="flightGeoJSON"
      >
        <mx-layer
          v-bind="mapSettings.flight.path"
          @mouseover="hoveringFeatures"
          @mouseleave="hoveringFeatures"
          @click="selectBranch"
        />
      </mx-source>
    </mx-map>
  </section>
</template>

<style lang="scss">
html,
body,
#app {
  height: 100%;
  width: 100%;
}

.profil-chart {
  position: relative;
  height: 40vh;
  width: 80vw;
  padding-left: 1em;
}
</style>

<script>
import DataToolbox from "@/components/toolboxes/DataToolbox";
import ProfileChart from "@/components/ProfileChart";
import MapX from "@/mixins/MapX";

export default {
  name: "Debriefing",
  mixins: [MapX],
  components: {
    DataToolbox,
    ProfileChart
  },
  data() {
    return {
      map: undefined,
      pointer: undefined,
      currentBranch: undefined,
    };
  },
  computed: {
    flight() {
      return this.$store.state.currentFlight;
    },
    flightGeoJSON() {
      return this.flight && this.flight.toGeoJSON("MultiLineString");
    }
  },
  watch: {
    flight(val) {
      val && this.map.fitBounds(val.bbox);
    }
  },
  methods: {
    selectBranch({ features }) {
      this._updateFeaturesState(features, (f, s) => {
        s.selected = !s.selected;
        this.currentBranch = s.selected
          ? this.flight.filter(
              b => b.properties.startedAt == f.properties.startedAt
            )[0]
          : undefined;
        return s;
      });
    },

    hoveringFeatures({ target, features }) {
      target.getCanvas().style.cursor =
        features && features.length > 0 ? "pointer" : "";
    },
    _updateFeaturesState(features, cb) {
      features.forEach((f, i) => {
        this.map.getFeatureState(f);
        this.map.setFeatureState(
          f,
          cb.call(this.map, f, this.map.getFeatureState(f), i)
        );
      });
    }
  }
};
</script>
