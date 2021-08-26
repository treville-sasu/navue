<template>
  <section class="box">
    <b-field grouped group-multiline>
      <b-loading :is-full-page="false" :active="baseURL === null && !error" />
      <b-field label="Airports ICAO Code" expanded>
        <b-icao v-model="searchCodes" />
      </b-field>
      <b-field v-if="poi" label="POI">
        <b-poi v-model="searchCodes" :items="poi" />
      </b-field>
    </b-field>

    <div class="grid">
      <ChartCartridge
        v-for="(map, key) in searchCodes"
        :key="'search_' + key"
        v-bind="map"
        :url="VACurl(map.id, baseURL)"
        :tags="{
          info: 'Airport'
        }"
        card
      >
        <figure class="image">
          <pdf
            :src="VACurl(map.id, baseURL).toString()"
            :page="1"
            style="height: 100%"
          />
        </figure>
      </ChartCartridge>
    </div>
  </section>
</template>

<script>
import BIcao from "@/components/buefy/BIcao.vue";
import BPoi from "@/components/buefy/BPoi.vue";

import ChartCartridge from "@/components/ChartCartridge.vue";
import Pdf from "vue-pdf";
import Sia from "@/mixins/Sia";

export default {
  name: "SiaVac",
  components: {
    BIcao,
    BPoi,
    ChartCartridge,
    Pdf
  },
  mixins: [Sia],
  props: {
    poi: Array
  },
  data() {
    return {
      error: false,
      searchCodes: [],
      baseURL: null,
      cachedUrls: []
    };
  },
  async mounted() {
    this.baseURL = await this.getCycleUrl();

    await caches.open("naVue_SIA_VAC").then(c => {
      c.add(
        "https://navue-proxy.treville.workers.dev/?cors=https%3A%2F%2Fwww.sia.aviation-civile.gouv.fr%2Fdvd%2FeAIP_20_MAY_2021%2FAtlas-VAC%2FPDF_AIPparSSection%2FVAC%2FAD%2FAD-2.LFFY.pdf"
      );
      c.add(
        "https://navue-proxy.treville.workers.dev/?cors=https://www.sia.aviation-civile.gouv.fr/dvd/eAIP_20_MAY_2021/Atlas-VAC/PDF_AIPparSSection/VAC/AD/AD-2.LFIX.pdf"
      );
    });
    this.cachedUrls = await caches.open("naVue_SIA_VAC").then(c => c.keys());
  },
  computed: {
    poiList() {
      return this.poi.map(id => ({ id, name: id }));
    }
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
    }
  }
};
</script>
