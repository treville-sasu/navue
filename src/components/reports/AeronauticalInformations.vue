<template>
  <section class="box">
    <b-tabs position="is-centered">
      <b-tab-item label="Notam">
        <SiaNotam :poi="poi" />
      </b-tab-item>
      <b-tab-item label="AZBA">
        <SiaAzba />
      </b-tab-item>
      <b-tab-item label="Sup AIP" disabled> </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import SiaNotam from "@/components/reports/SiaNotam.vue";
import SiaAzba from "@/components/reports/SiaAzba.vue";

export default {
  name: "AeronauticalInformations",
  components: {
    SiaNotam,
    SiaAzba
  },
  props: {
    poi: Array
  }
};
</script>
