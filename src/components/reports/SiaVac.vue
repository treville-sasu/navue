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
        :key="key"
        v-bind="map"
        :url="VACurl(map.id, baseURL)"
        :tags="{
          info: 'Airport'
        }"
        @click="openChartUrl = $event"
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
    <PDFModal v-model="openChartUrl" :active="!!openChartUrl" />
  </section>
</template>

<script>
import BIcao from "@/components/buefy/BIcao.vue";
import BPoi from "@/components/buefy/BPoi.vue";

import ChartCartridge from "@/components/ChartCartridge.vue";
import PDFModal from "@/components/PDFModal.vue";
import Pdf from "vue-pdf";
import Sia from "@/mixins/Sia";

export default {
  name: "SiaVac",
  components: {
    BIcao,
    BPoi,
    ChartCartridge,
    PDFModal,
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
      openChartUrl: null
    };
  },
  async mounted() {
    this.baseURL = await this.getCycleUrl();
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
  },
  watch: {
    baseURL(val) {
      this.$emit("update-url", val);
    }
  }
};
</script>
