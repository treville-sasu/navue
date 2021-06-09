<template>
  <b-taglist v-if="parameters">
    <b-tag type="is-primary" size="is-medium">{{
      parameters.speed | as("kt", 2)
    }}</b-tag>
    <b-tag type="is-success" size="is-medium">{{
      parameters.heading | as("°", 2)
    }}</b-tag>
    <b-tag type="is-info" size="is-medium">{{
      parameters.altitude | as("ft", 2)
    }}</b-tag>
    <b-tag type="is-dark" size="is-medium">-</b-tag>
  </b-taglist>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem";
import { Location } from "@/models/Waypoint.js";

export default {
  name: "InstrumentsDisplay",
  mixins: [UnitSystem],
  props: { parameters: Location },
    }
  }
};
</script>
