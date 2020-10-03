<template>
  <section class="section">
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
    <div class="columns">
      <div class="column is-half">
        <div class="notification">
          <b-field label="ICAO Code for FIR or Airports" expanded>
            <b-taginput
              v-model="selectedCodes"
              :data="filteredCodes"
              @typing="getFilteredCodes"
              @input="getMessages"
              autocomplete
              allow-new
              icon="label"
              placeholder="Type a code"
              maxtags="50"
              maxlength="4"
              field="id"
            >
              <template slot-scope="props">
                <strong>{{ props.option.id }}</strong
                >: <i>{{ props.option.name }}</i>
              </template>
              <template slot="empty">
                Code unknown, validate to check it.
              </template>
            </b-taginput>
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
                type="is-success"
              >
                {{ category }}
              </b-checkbox-button>
            </div>
          </b-field>
        </div>
        <section
          class="section"
          v-for="(stations, category) in messages"
          :key="category"
        >
          <WeatherMessage
            v-for="station in stations"
            :key="category + station.oaci"
            :station="station"
            :type="category"
          />
        </section>
      </div>
      <div class="column is-half">
        <div class="notification">
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
                >{{ option }}</option
              >
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
                type="is-success"
              >
                {{ name }}
              </b-checkbox-button>
            </div>
          </b-field>
        </div>
        <section class="section" v-for="(mapsSet, type) in maps" :key="type">
          <WeatherMap
            v-for="(map, key) in mapsSet"
            :key="key"
            :data="map"
            :src="proxyUrl(map.lien)"
          />
        </section>
      </div>
    </div>
  </section>
</template>

<style>
.select select {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

<script>
import Aeroweb from "@/mixins/aeroweb.js";
import WeatherMessage from "@/components/WeatherMessage.vue";
import WeatherMap from "@/components/WeatherMap.vue";

export default {
  components: {
    WeatherMessage,
    WeatherMap
  },
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
            return { id: station[0], name: station[1] };
          }
        ),
        ...require("@/store/vac.json")
      ],
      filteredCodes: [],
      selectedCodes: [],
      avaliableMessagesCategories: [
        "OPMET",
        "SIGMET"
        // "VAA",
        // "TCA",
        // "MAA",
        // "SW",
        // "PREDEC",
      ],
      selectedMessagesCategories: ["OPMET", "SIGMET"],
      avaliableMaps: Aeroweb.CARTES,
      selectedMapsZone: null,
      selectedMapsTypes: ["AERO_TEMSI", "AERO_WINTEM"],

      server: new Aeroweb("IBAUJYXSHD", {
        cors_proxy: this.proxyUrl
      }),
      messages: {},
      maps: {}
    };
  },
  // mounted() {
  //   navigator.serviceWorker.ready.then(() => {
  //   });
  // },
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
    }
  },
  methods: {
    proxyUrl(url) {
      return process.env.NODE_ENV != "production"
        ? "https://cors.treville.workers.dev/" + url
        : url;
    },
    getMessages(codes, categories) {
      (categories || this.selectedMessagesCategories).forEach(category => {
        this.server[category](codes.map(c => c.id || c))
          .then(data => {
            this.$set(this.messages, category, data);
          })
          .catch(err => {
            this.openWarning(err);
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
          .catch(err => {
            this.openWarning(err);
            this.maps[type] = [];
          });
      });
    },
    getFilteredCodes(text) {
      this.filteredCodes = this.avaliableCodes.filter(option => {
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
        message: "Can't get info from AeroWeb.",
        position: "is-bottom",
        type: "is-danger",
        duration: 2500
      });
    }
  },
  filters: {
    FL(num) {
      return `FL${num.toString().padStart(3, "0")}`;
    }
  }
};
</script>
