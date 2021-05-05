<template>
  <section>
    <div class="columns is-multiline">
      <b-loading
        :is-full-page="false"
        :active="!azba || (azba.length == 0 && !error)"
      >
        <b-notification has-icon icon="alert-circle-outline" :closable="false">
          <h4 class="title">SIA Server Unavailable</h4>
          <p class="heading">
            Check your connection or use SIA server directly
          </p>
          <a href="https://www.sia.aviation-civile.gouv.fr/" target="_blank"
            >https://www.sia.aviation-civile.gouv.fr/</a
          >
        </b-notification>
      </b-loading>
      <div
        class="column is-one-quarter"
        v-for="(map, key) in azba"
        :key="'azba' + key"
      >
        <ChartCartridge
          v-bind="map"
          :name="map.start | asDay"
          :tags="{
            danger: 'RTBA',
            warning: $options.filters.asTime(map.start),
            success: $options.filters.asTime(map.end)
          }"
          @click="openChartUrl = $event"
          card
        >
          <figure class="image">
            <pdf :src="map.url" :page="1" style="height: 100%" />
          </figure>
        </ChartCartridge>
      </div>
      <PDFModal v-model="openChartUrl" :active="!!openChartUrl" />
    </div>
  </section>
</template>

<script>
import ChartCartridge from "@/components/ChartCartridge.vue";
import PDFModal from "@/components/PDFModal.vue";
import Sia from "@/mixins/Sia";

import Pdf from "vue-pdf";

export default {
  name: "Azba",
  components: {
    ChartCartridge,
    PDFModal,
    Pdf
  },
  mixins: [Sia],
  data() {
    return {
      error: false,
      azba: [],
      openChartUrl: null
    };
  },
  async mounted() {
    this.azba = await this.getAZBA();
  },
  methods: {
    async getAZBA() {
      try {
        clearTimeout(this.error);
        this.error = false;
        return await this.getAZBAfiles();
      } catch (err) {
        console.error(err);
        this.error = setTimeout(this.getAZBA, 3000);
      }
    }
  },
  filters: {
    asTime(value) {
      return value.toLocaleString("fr-fr", {
        timeZone: "UTC",
        timeZoneName: "short",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit"
      });
    },
    asDay(value) {
      return value.toLocaleString("fr-fr", {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long"
      });
    }
  }
};
</script>
