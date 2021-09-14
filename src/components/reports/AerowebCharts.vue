<template>
  <section>
    <b-field label="Meteorological Zone" expanded>
      <b-select placeholder="Select a zone" v-model="query.zone" expanded>
        <option
          v-for="(option, key) in avaliableMaps.zones"
          :value="key"
          :key="key"
        >
          {{ option }}
        </option>
      </b-select>
    </b-field>
    <b-collapse :open="false" position="is-bottom">
      <template #trigger="props">
        <b-icon :icon="!props.open ? 'menu-down' : 'menu-up'"></b-icon>
        {{ !props.open ? "All options" : "Fewer options" }}
      </template>
      <b-field label="Charts type">
        <b-checkbox-button
          v-model="query.types"
          v-for="(name, value) in avaliableMaps.types"
          :key="value"
          :native-value="value"
        >
          {{ name }}
        </b-checkbox-button>
      </b-field>
      <b-field label="Floor Altitude">
        <b-slider disabled>
          <template v-for="val in avaliableMaps.altitudes">
            <b-slider-tick :value="val" :key="val">{{
              val | toFL
            }}</b-slider-tick>
          </template>
        </b-slider>
      </b-field>
    </b-collapse>
    <div class="placeholder" v-if="!results.length">
      Get forecast charts for selected zone.
      <b-loading :is-full-page="false" :active="isLoading" />
    </div>
    <div class="grid" v-else>
      <ChartCartridge
        v-for="(map, key) in results"
        :key="'search_' + key"
        :url="map.lien"
        :name="map.zone_carte"
        :tags="{
          primary: map.type,
          info: map.niveau,
          warning: map.echeance
        }"
        card
      >
      </ChartCartridge>
    </div>
  </section>
</template>

<style scoped>
.select select {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

<script>
import ChartCartridge from "@/components/ChartCartridge.vue";

import Aeroweb from "@/mixins/Aeroweb";
import CachableSearch from "@/mixins/CachableSearch";

export default {
  name: "AerowebCharts",
  components: {
    ChartCartridge
  },
  mixins: [Aeroweb, CachableSearch],
  data() {
    return {
      type: "forecast",
      query: {
        zone: "AERO_FRANCE",
        types: ["AERO_TEMSI", "AERO_WINTEM"],
        altitude: 20
      }
    };
  },
  methods: {
    async search() {
      this.results = [];
      this.isLoading = true;
      this.results = (await this.getMaps(this.query)).flat();
      this.isLoading = false;
    }
  },
  filters: {
    toFL(value) {
      return "FL" + value.toString().padStart(3, "0");
    }
  }
};
</script>
