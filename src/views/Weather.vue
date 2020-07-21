<template>
  <section class="section">
    <section class="hero is-primary">
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
      <b-field label="ICAO Code for FIR or Airports" expanded>
        <b-taginput
          v-model="codes"
          autocomplete
          allow-new
          :data="filteredTags"
          @typing="getFilteredCodes"
          icon="label"
          placeholder="Type a code"
          maxtags="50"
          maxlength="4"
          field="id"
          @input="getMessages"
        >
          <template slot-scope="props">
            <strong>{{ props.option.id }}</strong
            >: <i>{{ props.option.name }}</i>
          </template>
          <template slot="empty">
            Code not found.
          </template>
        </b-taginput>
      </b-field>
      <b-field grouped group-multiline>
        <b-field label="Zone">
          <b-select
            placeholder="Select a zone"
            v-model="carte.zone"
            @input="getMaps"
          >
            <option
              v-for="(option, key) in avaliableMaps.zones"
              :value="key"
              :key="key"
              >{{ option }}</option
            >
          </b-select>
        </b-field>
        <b-field label="Type">
          <b-select
            placeholder="Select a type"
            v-model="carte.type"
            @input="getMaps"
          >
            <option
              v-for="(option, key) in avaliableMaps.types"
              :value="key"
              :key="key"
              >{{ option }}</option
            >
          </b-select>
        </b-field>
        <b-field label="Altitude" expanded>
          <b-slider
            size="is-medium"
            :min="Math.min(...avaliableMaps.altitudes)"
            :max="Math.max(...avaliableMaps.altitudes)"
            v-model="carte.altitude"
            :tooltip="false"
            @input="getMaps"
            lazy
          >
            <template v-for="val in avaliableMaps.altitudes">
              <b-slider-tick :value="val" :key="val">{{
                val | FL
              }}</b-slider-tick>
            </template>
          </b-slider>
        </b-field>
      </b-field>
    </div>

    <div class="columns">
      <div class="column">
        <Opmet :stations="[...this.results.opmet, ...this.results.sigmet]" />
      </div>
      <div class="column">
        <WeatherMap
          v-for="(map, key) in results.maps"
          :value="map"
          :key="key"
        />
      </div>
    </div>
  </section>
</template>

<script>
const data = require("@/store/vac.json");

import Aeroweb from "@/mixins/aeroweb.js";
import Opmet from "@/components/Opmet.vue";
import WeatherMap from "@/components/WeatherMap.vue";

export default {
  components: {
    Opmet,
    WeatherMap,
  },
  data() {
    return {
      codes: [],
      filteredTags: data,
      carte: {
        zone: null,
        type: null,
        altitude: null,
      },
      server: new Aeroweb("IBAUJYXSHD", {
        cors_proxy: "https://cors.treville.workers.dev",
      }),
      avaliableMaps: Aeroweb.CARTES,
      results: { opmet: [], sigmet: [], maps: [] },
    };
  },
  // mounted() {
  //   this.server.VAG(Object.keys(Aeroweb.VAG)).then((res) => console.log(res));
  // },
  computed: {
    codesList() {
      return this.codes.map((c) => c.id || c);
    },
    carteParams() {
      return [this.carte.zone, this.carte.type, this.carte.altitude];
    },
  },
  methods: {
    getMessages() {
      this.server
        .OPMET(this.codesList)
        .then((res) => (this.results.opmet = res.data))
        .catch((err) => {
          this.openWarning(err);
          this.results.opmet = [];
        });
      this.server
        .SIGMET(this.codesList)
        .then((res) => (this.results.sigmet = res.data))
        .catch((err) => {
          this.openWarning(err);
          this.results.sigmet = [];
        });
    },
    getMaps() {
      this.server
        .CARTES(...this.carteParams)
        .then((res) => (this.results.maps = res.data))
        .catch((err) => {
          this.openWarning(err);
          this.results.maps = [];
        });
    },
    getFilteredCodes(text) {
      this.filteredTags = data.filter((option) => {
        return (
          option.name
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0 ||
          option.id
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        );
      });
    },
    openWarning(error) {
      console.error(error);
      this.$buefy.snackbar.open({
        message: error.message || "Can't get info from AeroWeb.",
        position: "is-bottom",
        type: "is-danger",
        duration: 2500,
      });
    },
  },
  filters: {
    FL(num) {
      return `FL${num.toString().padStart(3, "0")}`;
    },
  },
};
</script>
