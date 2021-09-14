<template>
  <section>
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
      <a
        href="https://www.sia.aviation-civile.gouv.fr/schedules"
        target="_blank"
        >https://www.sia.aviation-civile.gouv.fr/schedules</a
      >
    </b-notification>
    <div class="placeholder" v-else-if="!results.length">
      Searching for AZBA charts
      <b-loading :is-full-page="false" :active="isLoading" />
    </div>
    <div class="grid" v-else>
      <ChartCartridge
        v-for="(map, key) in results"
        :key="'azba' + key"
        v-bind="map"
        :name="map.start | asDay"
        :tags="{
          danger: 'RTBA',
          warning: $options.filters.asTime(map.start),
          success: $options.filters.asTime(map.end)
        }"
        card
      />
    </div>
  </section>
</template>

<script>
import ChartCartridge from "@/components/ChartCartridge.vue";
import Sia from "@/mixins/Sia";

export default {
  name: "SiaAzba",
  components: {
    ChartCartridge
  },
  data() {
    return {
      error: false,
      results: [],
      isLoading: false,
      sia: new Sia()
    };
  },
  async mounted() {
    try {
      this.results = await this.sia.getAZBA();
      this.error = false;
    } catch {
      this.error = true;
    }
  },
  // methods: {
  //   async getAZBA() {
  //     try {
  //       clearTimeout(this.error);
  //       this.error = false;
  //       return await this.getAZBAfiles();
  //     } catch (err) {
  //       console.error(err);
  //       this.error = setTimeout(this.getAZBA, 3000);
  //     }
  //   }
  // },
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
