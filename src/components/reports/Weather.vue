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
        <AerowebBulletin :poi="poi" />
      </b-tab-item>
      <b-tab-item label="Charts">
        <AerowebCharts />
      </b-tab-item>
      <b-tab-item label="Radar" disabled> </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import AerowebBulletin from "@/components/reports/AerowebBulletin.vue";
import AerowebCharts from "@/components/reports/AerowebCharts.vue";

import Aeroweb from "@/mixins/Aeroweb";

export default {
  name: "Weather",
  components: {
    AerowebBulletin,
    AerowebCharts
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
