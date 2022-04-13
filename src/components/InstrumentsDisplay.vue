<template>
  <b-taglist>
    <b-tag v-if="speed" type="is-primary" size="is-medium">{{ speed }}</b-tag>
    <b-tag v-if="heading" type="is-success" size="is-medium">{{
      heading
    }}</b-tag>
    <b-tag v-if="altitude" type="is-info" size="is-medium">{{
      altitude
    }}</b-tag>
    <b-tag v-if="linkHealth >= 0" type="is-dark" size="is-medium">
      <b-icon
        :icon="`wifi-strength-${linkHealth > 0 ? linkHealth : 'alert-outline'}`"
      />
    </b-tag>
  </b-taglist>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem";
import { Speed, Azimuth, Altitude } from "@/models/Quantities";

export default {
  name: "InstrumentsDisplay",
  mixins: [UnitSystem],
  props: {
    location: {
      type: Object,
      default() {
        return { properties: {} };
      },
    },
  },
  data() {
    return {
      linkStatus: undefined,
      linkHealth: undefined,
      goodBandwidth: 10,
      stepsBandwith: 4,
    };
  },
  computed: {
    speed() {
      return new Speed(this.location.properties.speed, undefined, {
        unit: "kt",
        precision: 3,
      });
    },
    heading() {
      return new Azimuth(this.location.properties.heading, undefined, {
        precision: 3,
      });
    },
    altitude() {
      if (this.location.properties.elevation)
        return new Altitude(this.location.properties.elevation, "m", {
          reference: this.location.properties.elevationReference,
          unit: "ft",
          precision: 3,
        });
      else
        return new Altitude(this.location.altitude, "m", {
          reference: this.location.properties.altitudeReference,
          unit: "ft",
          precision: 3,
        });
    },
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
      this.linkHealth = Math.round(
        (Math.min(currentTarget.downlink, this.goodBandwidth) /
          this.goodBandwidth) *
          this.stepsBandwith
      );
    },
  },
};
</script>
