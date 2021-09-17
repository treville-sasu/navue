<template>
  <section>
    <b-field label="Airports" expanded class="is-hidden-printer">
      <b-icao v-model="query" :presets="poi" />
    </b-field>

    <b-notification
      has-icon
      icon="alert-circle-outline"
      :closable="false"
      v-if="error"
    >
      <h4 class="title">SIA Server Unavailable</h4>
      <p class="heading">
        Check your connection or use SIA server directly
      </p>
      <a href="https://www.sia.aviation-civile.gouv.fr/" target="_blank"
        >https://www.sia.aviation-civile.gouv.fr/</a
      >
    </b-notification>
    <div class="placeholder" v-else-if="!query.length">
      Search for Visual Appraoch Charts.
      <b-loading :is-full-page="false" :active="isLoading" />
    </div>
    <div class="grid" v-else>
      <ChartCartridge
        v-for="(map, key) in results"
        :key="'query_' + key"
        v-bind="map"
        :tags="{
          info: map.type
        }"
        card
      />
    </div>
  </section>
</template>

<script>
import BIcao from "@/components/buefy/BIcao.vue";

import ChartCartridge from "@/components/ChartCartridge.vue";
import Sia from "@/mixins/Sia";
import CachableSearch from "@/mixins/CachableSearch";

export default {
  name: "SiaVac",
  components: {
    BIcao,
    ChartCartridge
  },
  mixins: [CachableSearch],
  data() {
    return {
      type: "VAC",
      query: [],
      timeout: 1,
      sia: new Sia()
    };
  },
  async mounted() {
    this.retryCycle();
  },
  methods: {
    async retryCycle() {
      try {
        clearTimeout(this.error);
        await this.sia.getCycle();
        this.error = false;
        this.search();
      } catch (err) {
        console.error(err);
        this.error = setTimeout(this.retryCycle, 3000);
      }
    },
    async search() {
      return this.query.map(code => {
        code.url = this.sia.getVAC(code.id);
        return code;
      });
    }
  }
};
</script>
