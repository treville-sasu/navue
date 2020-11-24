<template>
  <section>
    <section class="hero is-primary is-hidden-mobile">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Approach Charts</h1>
          <h2 class="subtitle">
            Get charts for VFR arrival on your airfields.
          </h2>
        </div>
      </div>
    </section>
    <div class="notification">
      <b-field label="ICAO Code for Airports" expanded>
        <b-taginput
          v-model="codes"
          autocomplete
          :data="filteredTags"
          @typing="getFilteredCodes"
          icon="label"
          placeholder="LFxx, ..., tar..."
          maxtags="50"
          maxlength="4"
          field="id"
        >
          <template slot-scope="props">
            <strong>{{ props.option.id }}</strong
            >: <i>{{ props.option.name }}</i>
          </template>
          <template slot="empty"> Code not found. </template>
        </b-taginput>
      </b-field>
    </div>

    <section class="section">
      <div class="box" v-for="(map, key) in codes" :key="key">
        <ChartCartridge
          v-bind="map"
          :url="map.id | asVACurl(baseURL)"
          :tags="{
            info: 'Airport',
          }"
          @click="openChartUrl = $event"
        >
          <b-icon icon="airplane-landing" size="is-large" type="is-primary" />
        </ChartCartridge>
      </div>
      <PDFModal v-model="proxyChartUrl" :active="!!proxyChartUrl" />
    </section>
  </section>
</template>

<script>
const data = require("@/store/vac.json");

import ChartCartridge from "@/components/ChartCartridge.vue";
import PDFModal from "@/components/PDFModal.vue";
import Sia from "@/mixins/Sia";

export default {
  name: "ApproachChart",
  components: {
    ChartCartridge,
    PDFModal
  },
  mixins: [Sia],
  data() {
    return {
      baseURL: null,
      codes: [],
      openChartUrl: null,
      filteredTags: data
    };
  },
  async mounted() {
    this.baseURL = await this.getVACbaseUrl(this.VACSourceUrl);
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
  methods: {
    getFilteredCodes(text) {
      this.filteredTags = data.filter(option => {
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
    }
  },
  filters: {
    asVACurl(value, base) {
      return new URL(`AD-2.${value}.pdf`, base).href;
    }
  }
};
</script>
