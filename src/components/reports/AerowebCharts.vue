<template>
  <section>
    <b-field grouped group-multiline>
      <b-field label="Meteorological Zone" expanded>
        <b-select
          placeholder="Select a zone"
          v-model="searchZones"
          @input="getMaps"
          expanded
        >
          <option
            v-for="(option, key) in avaliableMaps.zones"
            :value="key"
            :key="key"
          >
            {{ option }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Chart type">
        <b-checkbox-button
          v-model="searchTypes"
          v-for="(name, type) in avaliableMaps.types"
          :key="type"
          :native-value="type"
          type="is-primary"
        >
          {{ name }}
        </b-checkbox-button>
      </b-field>
    </b-field>

    <div class="block" v-for="(mapsSet, type) in resultsMaps" :key="type">
      <div class="box" v-for="(map, key) in mapsSet" :key="key">
        <ChartCartridge
          v-bind="map"
          :url="map.lien"
          :name="map.zone_carte"
          :tags="{
            primary: map.type,
            info: map.niveau,
            warning: map.echeance
          }"
        >
          <b-icon
            :icon="
              map.type == 'TEMSI' ? 'weather-partly-cloudy' : 'weather-windy'
            "
            size="is-large"
            type="is-primary"
          />
        </ChartCartridge>
      </div>
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

export default {
  name: "AerowebCharts",
  components: {
    ChartCartridge
  },
  mixins: [Aeroweb],
  props: {
    poi: Array
  },
  data() {
    return {
      resultsMaps: {}
    };
  },
  watch: {
    searchTypes(newVal, oldVal) {
      oldVal
        .filter(x => !newVal.includes(x))
        .forEach(type => {
          delete this.resultsMaps[type];
        });

      this.getMaps(
        this.searchZones,
        newVal.filter(x => !oldVal.includes(x))
      );
    }
  }
};
</script>
