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
        'is-loading': !validated && !error
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
            v-model="selectedCodes"
            maxtags="12"
            :data="avaliableCodes"
            @input="getMessages"
            allow-new
          />
        </b-field>
        <b-field position="is-centered" expanded>
          <div
            class="control"
            v-for="category in avaliableMessagesCategories"
            :key="category"
          >
            <b-checkbox-button
              v-model="selectedMessagesCategories"
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
            v-model="selectedMapsZone"
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
              v-model="selectedMapsTypes"
              :native-value="type"
              type="is-primary"
            >
              {{ name }}
            </b-checkbox-button>
          </div>
        </b-field>
      </b-field>
    </div>

    <section class="section">
      <h2 class="subtitle">Messages :</h2>
      <div
        class="block"
        v-for="(stations, category) in messages"
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
    <section class="section">
      <h2 class="subtitle">Weather Charts :</h2>
      <div class="block" v-for="(mapsSet, type) in maps" :key="type">
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
//TODO: make Aeroweb an external dependency. Build a mixins for aeroweb usage.
import BIcao from "@/components/BIcao.vue";

import Aeroweb from "@/mixins/aeroweb.js";
import WeatherMessage from "@/components/WeatherMessage.vue";

import ChartCartridge from "@/components/ChartCartridge.vue";
import PDFModal from "@/components/PDFModal.vue";

import CorsProxy from "@/mixins/CorsProxy";

export default {
  name: "Weather",
  components: {
    BIcao,
    WeatherMessage,
    ChartCartridge,
    PDFModal
  },
  mixins: [CorsProxy],
  data() {
    return {
      avaliableCodes: [
        ...Array.from(
          Object.entries({
            ...Aeroweb.VAA,
            ...Aeroweb.TCA,
            ...Aeroweb.PREDEC
          }),
          station => {
            return { id: station[0], name: station[1], type: "weather" };
          }
        ),
        ...require("@/store/vac.json")
      ],
      selectedCodes: [],
      avaliableMessagesCategories: [
        "OPMET",
        "SIGMET"
        // "VAA",
        // "TCA",
        // "MAA",
        // "SW",
        // "PREDEC"
      ],
      selectedMessagesCategories: ["OPMET", "SIGMET"],
      avaliableMaps: Aeroweb.CARTES,
      selectedMapsZone: null,
      selectedMapsTypes: ["AERO_TEMSI", "AERO_WINTEM"],

      server: new Aeroweb("IBAUJYXSHD", {
        cors_proxy: this.proxyUrl
      }),
      messages: {},
      maps: {},
      openChartUrl: null,
      validated: undefined,
      error: false
    };
  },
  async mounted() {
    try {
      this.validated = await this.server.VALIDATION("mabrenac");
    } catch {
      this.error = true;
    }
  },
  computed: {
    proxyChartUrl: {
      get() {
        return this.openChartUrl ? this.proxyUrl(this.openChartUrl) : null;
      },
      set(val) {
        this.openChartUrl = val;
      }
    }
  },
  watch: {
    selectedMessagesCategories(newVal, oldVal) {
      oldVal
        .filter(x => !newVal.includes(x))
        .forEach(op => {
          this.messages[op] = [];
        });

      this.getMessages(
        this.selectedCodes,
        newVal.filter(x => !oldVal.includes(x))
      );
    },
    selectedMapsTypes(newVal, oldVal) {
      oldVal
        .filter(x => !newVal.includes(x))
        .forEach(op => {
          this.maps[op] = [];
        });

      this.getMaps(
        this.selectedMapsZone,
        newVal.filter(x => !oldVal.includes(x))
      );
      //FIXME changing types do not update maps correctly
    }
  },
  methods: {
    getMessages(codes, categories) {
      (categories || this.selectedMessagesCategories).forEach(category => {
        this.server[category](codes.map(c => c.id || c))
          .then(data => {
            this.$set(this.messages, category, data);
          })
          .catch(() => {
            this.error = true;
            this.messages[category] = [];
          });
      });
    },
    getMaps(zone, types) {
      (types || this.selectedMapsTypes).forEach(type => {
        this.server
          .CARTES(zone || this.selectedMapsZone, type)
          .then(data => {
            this.$set(this.maps, type, data);
          })
          .catch(() => {
            this.error = true;
            this.maps[type] = [];
          });
      });
    }
  }
};
</script>
