<template>
  <section>
    <section class="hero is-primary is-hidden-mobile" v-if="codes.length == 0">
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
      <b-loading :is-full-page="false" :active="baseURL === null && !error" />
      <b-loading :is-full-page="false" :active="error">
        <b-notification
          has-icon
          icon="alert-circle-outline"
          :closable="false"
          aria-close-label="Close notification"
        >
          <h4 class="title">SIA Server Unavailable</h4>
          <p class="heading">
            Check your connection or use SIA server directly
          </p>
          <a href="https://www.sia.aviation-civile.gouv.fr/" target="_blank"
            >https://www.sia.aviation-civile.gouv.fr/</a
          >
        </b-notification>
      </b-loading>
      <b-field label="ICAO Code for Airports" expanded>
        <b-icao v-model="codes" />
      </b-field>
    </div>

    <section class="section">
      <div class="columns is-multiline">
        <div
          class="column is-one-quarter"
          v-for="(map, key) in codes"
          :key="key"
        >
          <ChartCartridge
            v-bind="map"
            :url="map.id | asVACurl(baseURL)"
            :tags="{
              info: 'Airport',
            }"
            @click="openChartUrl = $event"
            card
          >
            <figure class="image">
              <pdf
                :src="proxyUrl($options.filters.asVACurl(map.id, baseURL))"
                :page="1"
                style="height: 100%"
              />
            </figure>
          </ChartCartridge>
        </div>
        <PDFModal v-model="proxyChartUrl" :active="!!proxyChartUrl" />
      </div>
    </section>
  </section>
</template>

<script>
import BIcao from "@/components/BIcao.vue";

import ChartCartridge from "@/components/ChartCartridge.vue";
import PDFModal from "@/components/PDFModal.vue";
import Pdf from "vue-pdf";
import Sia from "@/mixins/Sia";

export default {
  name: "ApproachChart",
  components: {
    BIcao,
    ChartCartridge,
    PDFModal,
    Pdf,
  },
  mixins: [Sia],
  data() {
    return {
      error: false,
      codes: [],
      baseURL: null,
      openChartUrl: null,
    };
  },
  async mounted() {
    this.baseURL = await this.getCycleUrl();
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
  methods: {
    async getCycleUrl() {
      try {
        clearTimeout(this.error);
        this.error = false;
        return await this.getVACbaseUrl();
      } catch (err) {
        console.error(err);
        this.error = setTimeout(this.getCycleUrl, 3000);
      }
    },
  },
  filters: {
    asVACurl(value, base) {
      return new URL(`AD-2.${value}.pdf`, base).href;
    },
  },
};
</script>
