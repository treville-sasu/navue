<template>
  <section class="box">
    <b-field grouped>
      <b-loading :is-full-page="false" :active="baseURL === null && !error" />
      <b-field label="Airports ICAO Code" expanded>
        <b-icao v-model="searchCodes" />
      </b-field>
      <b-field v-if="poi" label="POI">
        <b-checkbox-button
          v-model="selectedPoi"
          v-for="id in poi"
          :key="id"
          size="is-small"
          :native-value="id"
        >
          {{ id }}
        </b-checkbox-button>
      </b-field>
    </b-field>

    <div class="columns is-multiline">
      <div
        class="column is-one-quarter"
        v-for="(map, key) in codesList"
        :key="key"
      >
        <ChartCartridge
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
    </div>
  </section>
</template>

<script>
import BIcao from "@/components/buefy/BIcao.vue";

import ChartCartridge from "@/components/ChartCartridge.vue";
import PDFModal from "@/components/PDFModal.vue";
import Pdf from "vue-pdf";
import Sia from "@/mixins/Sia";

export default {
  name: "Vac",
  components: {
    BIcao,
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
      selectedPoi: [],
      baseURL: null,
      openChartUrl: null
    };
  },
  async mounted() {
    this.baseURL = await this.getCycleUrl();
  },
  computed: {
    codesList() {
      this.selectedPoi;
      return [
        ...this.selectedPoi.map(id => {
          return { id, name: id };
        }),
        ...this.searchCodes
      ];
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
