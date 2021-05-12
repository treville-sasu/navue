<template>
  <section>
    <section class="hero is-primary is-hidden-mobile">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Quick search</h1>
          <h2 class="subtitle">
            Get METAR, TAF, Notam, Azba at a glance.
          </h2>
          <b-button icon-right="reload" @click="reloadDate = Date.now()"
            >Reload data</b-button
          >
        </div>
      </div>
    </section>
    <section class="section">
      <h2 class="title">METAR & TAF</h2>
      <WeatherBulletin :poi="codes" :key="reloadDate" />
    </section>
    <section class="section">
      <h2 class="title">Notam</h2>
      <Notam :poi="codes" :key="reloadDate" />
    </section>
    <section class="section">
      <h2 class="title">Azba</h2>
      <Azba :key="reloadDate" />
    </section>
  </section>
</template>

<style scoped>
.select select {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

<script>
import WeatherBulletin from "@/components/reports/WeatherBulletin.vue";
import Notam from "@/components/reports/Notam.vue";
import Azba from "@/components/reports/Azba.vue";

export default {
  name: "Local",
  components: {
    WeatherBulletin,
    Notam,
    Azba
  },
  props: { codes: Array },
  data: function() {
    return { reloadDate: 0 };
  }
};
</script>
