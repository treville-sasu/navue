<template>
  <section class="box">
    <b-loading
      :is-full-page="false"
      :active="validated === undefined && !error"
    >
      <b-notification
        has-icon
        icon="alert-circle-outline"
        :closable="false"
        aria-close-label="Close notification"
      >
        <h4 class="title">Aeroweb Server Unavailable</h4>
        <p class="heading">
          Check your connection or use Meteo France server directly
        </p>
        <a href="https://aviation.meteo.fr" target="_blank"
          >https://aviation.meteo.fr</a
        >
      </b-notification>
    </b-loading>

    <b-tabs position="is-centered">
      <b-tab-item label="Bulletin">
        <WeatherBulletin :poi="poi" />
      </b-tab-item>
      <b-tab-item label="Charts">
        <WeatherCharts />
      </b-tab-item>
      <b-tab-item label="Radar" disabled> </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import WeatherBulletin from "@/components/reports/WeatherBulletin.vue";
import WeatherCharts from "@/components/reports/WeatherCharts.vue";

import Aeroweb from "@/mixins/Aeroweb";

export default {
  name: "Weather",
  components: {
    WeatherBulletin,
    WeatherCharts
  },
  mixins: [Aeroweb],
  props: {
    poi: Array
  },
  data() {
    return {
      validated: undefined,
      error: false
    };
  },
  async mounted() {
    this.validated = await this.validateUser("navue");
  },
  methods: {
    async validateUser(user) {
      try {
        clearTimeout(this.error);
        this.error = false;
        return await this.aerowebInstance.VALIDATION(user);
      } catch (err) {
        console.error(err);
        this.error = setTimeout(this.validateUser, 3000, user);
      }
    }
  }
};
</script>
