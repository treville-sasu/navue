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
    <div class="notification">
      <b-loading
        :is-full-page="false"
        :active="validated === undefined && !error"
      />
      <b-loading :is-full-page="false" :active="error">
        <b-notification
          has-icon
          icon="alert-circle-outline"
          :closable="false"
          aria-close-label="Close notification"
        >
          <h4 class="title">Aeroweb Server Unavailable</h4>
          <p class="heading">
            Check your connection or use Meteo France server directly
          </p>
          <a href="https://aviation.meteo.fr" target="_blank"
            >https://aviation.meteo.fr</a
          >
        </b-notification>
      </b-loading>

      <b-field grouped group-multiline>
        <b-field label="ICAO Code for FIR or Airports" expanded>
          <b-icao
            v-model="searchCodes"
            maxtags="12"
            :data="avaliableCodes"
            allow-new
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
      <Timer
        ref="searchTimer"
        :duration="1000"
        countdown
        @timesup="getBulletin()"
        type="is-primary"
        size="is-small"
        class="mt-5"
        style="height: 0.35em"
      />
    </div>

    <div
      class="block"
      v-for="(stations, category) in resultsMessages"
      :key="category"
    >
      <b-notification
        v-for="(station, key1) in stations"
        :key="`${category}_${station.oaci}`"
        aria-close-label="Close notification"
        @close="$delete(resultsMessages[category], key1)"
      >
        <h4>
          {{ station.oaci }} -
          {{ station.nom }}
        </h4>
        <WeatherMessage
          v-for="(message, key2) in station.messages"
          :key="`${category}_${station.oaci}_${key2}`"
          :message="message"
        />
      </b-notification>
    </div>

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
    <PDFModal v-model="openChartUrl" :active="!!openChartUrl" />
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
import BIcao from "@/components/buefy/BIcao.vue";

import WeatherMessage from "@/components/WeatherMessage.vue";

import ChartCartridge from "@/components/ChartCartridge.vue";
import PDFModal from "@/components/PDFModal.vue";
import Timer from "@/components/buefy/Timer.vue";

import Aeroweb from "@/mixins/Aeroweb";

export default {
  name: "Weather",
  components: {
    BIcao,
    Timer,
    WeatherMessage,
    ChartCartridge,
    PDFModal
  },
  mixins: [Aeroweb],
  data() {
    return {
      searchCodes: [],
      searchCategories: ["OPMET"],
      searchZones: null,
      searchTypes: ["AERO_TEMSI", "AERO_WINTEM"],
      resultsMessages: {},
      resultsMaps: {},
      openChartUrl: null,
      validated: undefined,
      error: false
    };
  },
  async mounted() {
    this.validated = await this.validateUser("navue");
  },
  watch: {
    searchCodes(codes) {
      this.$refs.searchTimer.flyback();
      if (!this.$refs.searchTimer.running) this.$refs.searchTimer.start();
      if (codes.length == 0) this.$refs.searchTimer.reset();
    },
    searchCategories(newVal, oldVal) {
      oldVal
        .filter(x => !newVal.includes(x))
        .forEach(category => {
          delete this.resultsMessages[category];
        });

      this.getMessages(
        this.searchCodes,
        newVal.filter(x => !oldVal.includes(x))
      );
    },
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
  },
  methods: {
    getBulletin() {
      this.$refs.searchTimer.hold(async () => {
        await this.getMessages(this.searchCodes);
      });
    },
    async validateUser(user) {
      try {
        clearTimeout(this.error);
        this.error = false;
        return await this.aerowebInstance.VALIDATION(user);
      } catch (err) {
        console.error(err);
        this.error = setTimeout(this.validateUser, 3000, user);
      }
    }
  }
};
</script>
