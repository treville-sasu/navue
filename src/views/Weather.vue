<template>
  <section>
    <section class="hero is-primary is-hidden-mobile">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Weather</h1>
          <h2 class="subtitle">
            Get METAR, TAF and Weather Maps from AEROWEB (Météofrance).
          </h2>
        </div>
      </div>
    </section>
    <div
      class="notification"
      v-bind:class="{
        'is-loading': validated == undefined && !error,
      }"
    >
      <div
        class="message level is-warning is-overlay"
        v-bind:class="{ 'is-hidden': !error }"
        style="z-index: 6; margin-bottom: 0"
      >
        <div class="level-item has-text-centered" style="display: inline-block">
          <h4 class="title">
            <b-icon
              icon="alert-circle-outline"
              type="is-danger"
              size="is-large"
            />
            Aeroweb Server Unavailable
          </h4>
          <p class="heading">
            Check your connection or use Meteo France server directly
          </p>
          <a href="https://aviation.meteo.fr" target="_blank"
            >https://aviation.meteo.fr</a
          >
        </div>
      </div>
      <b-field grouped>
        <b-field label="ICAO Code for FIR or Airports" expanded>
          <b-icao
            v-model="searchCodes"
            maxtags="12"
            :data="avaliableCodes"
            allow-new
            @input="getMessages"
          />
        </b-field>
        <b-field position="is-centered" expanded>
          <div
            class="control"
            v-for="category in avaliableCategories"
            :key="category"
          >
            <b-checkbox-button
              v-model="searchCategories"
              :native-value="category"
              type="is-primary"
            >
              {{ category }}
            </b-checkbox-button>
          </div>
        </b-field>
      </b-field>
      <b-field grouped>
        <b-field label="Meteorological Zone" expanded>
          <b-select
            placeholder="Select a zone"
            v-model="searchZones"
            @input="getMaps"
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
        <b-field position="is-centered" expanded>
          <div
            class="control"
            v-for="(name, type) in avaliableMaps.types"
            :key="type"
          >
            <b-checkbox-button
              v-model="searchTypes"
              :native-value="type"
              type="is-primary"
            >
              {{ name }}
            </b-checkbox-button>
          </div>
        </b-field>
      </b-field>
    </div>

    <section class="section" v-if="Object.keys(resultsMessages).length > 0">
      <h2 class="subtitle">Messages :</h2>
      <div
        class="block"
        v-for="(stations, category) in resultsMessages"
        :key="category"
      >
        <WeatherMessage
          v-for="station in stations"
          :key="category + station.oaci"
          :station="station"
          :type="category"
        />
      </div>
    </section>
    <section class="section" v-if="Object.keys(resultsMaps).length > 0">
      <h2 class="subtitle">Weather Charts :</h2>
      <div class="block" v-for="(mapsSet, type) in resultsMaps" :key="type">
        <div class="box" v-for="(map, key) in mapsSet" :key="key">
          <ChartCartridge
            v-bind="map"
            :url="map.lien"
            :name="map.zone_carte"
            :tags="{
              primary: map.type,
              info: map.niveau,
              warning: map.echeance,
            }"
            @click="openChartUrl = $event"
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
      <PDFModal v-model="proxyChartUrl" :active="!!proxyChartUrl" />
    </section>
  </section>
</template>

<style scoped>
.select select {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

<script>
//TODO: Check why messages request are sent twice.
import BIcao from "@/components/BIcao.vue";

import WeatherMessage from "@/components/WeatherMessage.vue";

import ChartCartridge from "@/components/ChartCartridge.vue";
import PDFModal from "@/components/PDFModal.vue";

import Aeroweb from "@/mixins/Aeroweb";
import CorsProxy from "@/mixins/CorsProxy";

export default {
  name: "Weather",
  components: {
    BIcao,
    WeatherMessage,
    ChartCartridge,
    PDFModal,
  },
  mixins: [Aeroweb, CorsProxy],
  data() {
    return {
      searchCodes: [],
      searchCategories: ["OPMET", "SIGMET"],
      searchZones: null,
      searchTypes: ["AERO_TEMSI", "AERO_WINTEM"],
      resultsMessages: {},
      resultsMaps: {},
      openChartUrl: null,
      validated: undefined,
      error: false,
    };
  },
  async mounted() {
    this.validated = await this.validateUser("navue");
  },
  computed: {
    proxyChartUrl: {
      get() {
        return this.openChartUrl ? this.proxyUrl(this.openChartUrl) : null;
      },
      set(val) {
        this.openChartUrl = val;
      },
    },
  },
  watch: {
    searchCategories(newVal, oldVal) {
      oldVal
        .filter((x) => !newVal.includes(x))
        .forEach((category) => {
          delete this.resultsMessages[category];
        });

      this.getMessages(
        this.searchCodes,
        newVal.filter((x) => !oldVal.includes(x))
      );
    },
    searchTypes(newVal, oldVal) {
      oldVal
        .filter((x) => !newVal.includes(x))
        .forEach((type) => {
          delete this.resultsMaps[type];
        });

      this.getMaps(
        this.searchZones,
        newVal.filter((x) => !oldVal.includes(x))
      );
    },
  },
  methods: {
    async validateUser(user) {
      try {
        clearTimeout(this.error);
        this.error = false;
        return await this.aerowebInstance.VALIDATION(user);
      } catch (err) {
        console.error(err);
        this.error = setTimeout(this.validateUser, 3000, user);
      }
    },
  },
};
</script>
