<template>
  <section class="box">
    <b-tabs position="is-centered" destroy-on-hide>
      <b-tab-item label="VAC">
        <SiaVac />
      </b-tab-item>
      <b-tab-item label="BasULM" disabled>
        <!-- <BasULM /> -->
      </b-tab-item>
      <b-tab-item label="Instrument approach" disabled> </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import SiaVac from "@/components/reports/SiaVac.vue";

export default {
  name: "Charts",
  components: {
    SiaVac
  }
};
</script>
