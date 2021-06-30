<template>
  <b-taglist>
    <b-tag type="is-primary" size="is-medium">{{
      speed | as("kt", 3)
    }}</b-tag>
    <b-tag type="is-success" size="is-medium">{{
      heading | as("°", 3)
    }}</b-tag>
    <b-tag type="is-info" size="is-medium">{{
      altitude | as("ft", 3)
    }}</b-tag>
    <b-tag type="is-dark" size="is-medium">-</b-tag>
  </b-taglist>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem";
import { Speed, Azimuth, Altitude } from "@/models/Quantities.js";

export default {
  name: "InstrumentsDisplay",
  mixins: [UnitSystem],
  props: { 
    speed: Speed, 
    heading:Azimuth, 
    altitude:Altitude
  }
};
</script>
