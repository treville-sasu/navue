<template>
  <b-taglist>
    <b-tag type="is-primary" size="is-medium">{{ speed | as("kt", 2) }}</b-tag>
    <b-tag type="is-success" size="is-medium">{{ heading | as("°", 2) }}</b-tag>
    <b-tag type="is-info" size="is-medium">{{ altitude | as("ft", 2) }}</b-tag>
    <b-tag type="is-dark" size="is-medium">{{
      verticalSpeed | as("ft/min", 2)
    }}</b-tag>
  </b-taglist>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem";

export default {
  name: "InstrumentsDisplay",
  mixins: [UnitSystem],
  props: ["altitude", "heading", "speed", "verticalSpeed"]
};
</script>
