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
    <div
      class="notification"
      v-bind:class="{ 'is-loading': baseURL === null && !error }"
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
            SIA Server Unavailable
          </h4>
          <p class="heading">
            Check your connection or use SIA server directly
          </p>
          <a href="https://www.sia.aviation-civile.gouv.fr/" target="_blank"
            >https://www.sia.aviation-civile.gouv.fr/</a
          >
        </div>
      </div>
      <b-field label="ICAO Code for Airports" expanded>
        <b-icao v-model="codes" />
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
import BIcao from "@/components/BIcao.vue";

import ChartCartridge from "@/components/ChartCartridge.vue";
import PDFModal from "@/components/PDFModal.vue";
import Sia from "@/mixins/Sia";

export default {
  name: "ApproachChart",
  components: {
    BIcao,
    ChartCartridge,
    PDFModal
  },
  mixins: [Sia],
  data() {
    return {
      error: false,
      codes: [],
      baseURL: null,
      openChartUrl: null
    };
  },
  async mounted() {
    try {
      this.baseURL = await this.getVACbaseUrl(this.VACSourceUrl);
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
  filters: {
    asVACurl(value, base) {
      return new URL(`AD-2.${value}.pdf`, base).href;
    }
  }
};
</script>
