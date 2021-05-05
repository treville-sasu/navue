<template>
  <section class="box">
    <b-tabs position="is-centered">
      <b-tab-item label="Notam">
        <Notam :poi="poi" />
      </b-tab-item>
      <b-tab-item label="AZBA">
        <Azba />
      </b-tab-item>
      <b-tab-item label="Sup AIP" disabled> </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import Notam from "@/components/reports/Notam.vue";
import Azba from "@/components/reports/Azba.vue";

export default {
  name: "AeronauticalInformations",
  components: {
    Notam,
    Azba
  },
  props: {
    poi: Array
  }
};
</script>
