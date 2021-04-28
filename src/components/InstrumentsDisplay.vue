<template>
  <b-taglist v-if="location">
    <b-tag type="is-primary" size="is-medium">{{
      location.speed | as("kt", 2)
    }}</b-tag>
    <b-tag type="is-success" size="is-medium">{{
      location.heading | as("°", 2)
    }}</b-tag>
    <b-tag type="is-info" size="is-medium">{{
      location.altitude | as("ft", 2)
    }}</b-tag>
    <b-tag type="is-dark" size="is-medium">-</b-tag>
  </b-taglist>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem";

export default {
  name: "InstrumentsDisplay",
  mixins: [UnitSystem],
  computed: {
    location() {
      return this.$store.state.currentLocation;
    }
  }
};
</script>
