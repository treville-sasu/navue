<template>
  <b-taglist>
    <b-tag type="is-primary" size="is-medium">{{ speed | as("kt", 3) }}</b-tag>
    <b-tag type="is-success" size="is-medium">{{ heading | as("°", 3) }}</b-tag>
    <b-tag type="is-info" size="is-medium">{{ altitude | as("ft", 3) }}</b-tag>
    <b-tag type="is-dark" size="is-medium" v-if="linkStatus >= 0">
      <b-icon :icon="`wifi-strength-${linkStatus > 0 ? linkStatus : 'off'}`" />
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
      linkStatus: undefined
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
      if (currentTarget.downlink)
        if (currentTarget.downlinkMax)
          this.linkStatus = Math.round(
            (currentTarget.downlink / currentTarget.downlinkMax) * 4
          );
        else
          this.linkStatus = Math.min(
            Math.round((currentTarget.downlink / 5) * 4),
            4
          );
    }
  }
};
</script>
