<template>
  <b-taglist>
    <b-tag type="is-primary" size="is-medium" v-if="speed">{{
      speed | as("kt", 2)
    }}</b-tag>
    <b-tag type="is-success" size="is-medium" v-if="heading">{{
      heading | as("°", 2)
    }}</b-tag>
    <b-tag type="is-info" size="is-medium" v-if="altitude">{{
      altitude | as("ft", 2)
    }}</b-tag>
    <b-tag type="is-dark" size="is-medium" v-if="uplink !== undefined">
      <b-icon
        :icon="uplink > 0 ? `wifi-strength-${uplink}` : 'wifi-strength-off'"
      />
    </b-tag>
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
    heading: Azimuth,
    altitude: Altitude
  },
  data() {
    return {
      uplink: undefined
    };
  },
  /* eslint-disable compat/compat */
  mounted() {
    if (navigator.connection) {
      this.setLink({ currentTarget: navigator.connection });
      navigator.connection.addEventListener("change", this.setLink);
    }
  },
  beforeDestroy() {
    if (navigator.connection)
      navigator.connection.removeEventListener("change", this.setLink);
  },
  methods: {
    setLink({ currentTarget }) {
      this.uplink = Math.min(Math.round((currentTarget.downlink / 5) * 4), 4);
    }
  }
};
</script>
