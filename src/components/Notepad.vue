<template>
  <section class="box">
    <b-field label="Notes">
      <b-input
        v-model="flight.notes"
        maxlength="1000"
        type="textarea"
      ></b-input>
    </b-field>
  </section>
</template>

<script>
// import { Distance, Speed } from "@/models/Quantities";

import UnitSystem from "@/mixins/UnitSystem";

export default {
  name: "Notepad",
  mixins: [UnitSystem],
  computed: {
    flight() {
      return this.$store.state.currentFlight;
    }
  }
};
</script>
