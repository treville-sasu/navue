<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <h2 class="tite">
        ATIS
      </h2>
    </header>
    <section class="modal-card-body">
      <!-- <b-direction :min="12" :max="36" double /> -->
      <!-- :picker-size="faceSize" -->
      <!-- :face-numbers="isSelectingHour ? hours : minutes"
        :disabled-values="faceDisabledValues"
        :value="isSelectingHour ? hoursSelected : minutesSelected"
        @input="onClockInput"
        @change="onClockChange" -->
      <b-field grouped horizontal label="QNH">
        <b-slider v-model="qnh" :min="9.5" :max="10.4" :step="0.1" expanded>
          <b-slider-tick :value="9.5">{{ 950 | P("hPa") }}</b-slider-tick>
          <b-slider-tick :value="10.13">Sdt</b-slider-tick>
          <b-slider-tick :value="10.4">{{ 1040 | P("hPa") }}</b-slider-tick>
        </b-slider>
        <p class="control">
          <b-tag>{{ qnh | P("hPa") }}</b-tag>
        </p>
      </b-field>
      <b-field horizontal label="Wind direction">
        <b-slider v-model="wind.direction" :min="0" :max="360" :step="10">
          <b-slider-tick :value="0">N</b-slider-tick>
          <b-slider-tick :value="90">E</b-slider-tick>
          <b-slider-tick :value="180">S</b-slider-tick>
          <b-slider-tick :value="270">W</b-slider-tick>
          <b-slider-tick :value="360">N</b-slider-tick>
        </b-slider>
        <p class="control">
          <b-tag>{{ wind.direction | A("°") }}</b-tag>
        </p>
      </b-field>
      <b-field horizontal label="Wind Speed">
        <b-slider v-model="wind.speed" :min="0" :max="60" :step="5" />
        <p class="control">
          <b-tag>{{ wind.speed | S("kt") }}</b-tag>
        </p>
      </b-field>
      <b-field horizontal grouped label="Visibility">
        <b-slider v-model="visibility" :min="0" :max="10000" :step="500">
          <b-slider-tick :value="0">{{ 0 | D("Km") }}</b-slider-tick>
          <b-slider-tick :value="1500">VFR-S</b-slider-tick>
          <b-slider-tick :value="2000">{{ 2 | D("Km") }}</b-slider-tick>
          <b-slider-tick :value="5000">VFR</b-slider-tick>
          <b-slider-tick :value="10000">> {{ 10 | D("Km") }}</b-slider-tick>
        </b-slider>
        <p class="control">
          <b-tag>{{ visibility | D("Km") }}</b-tag>
        </p>
      </b-field>
      <b-field horizontal label="Temperature">
        <b-slider v-model="temperature" :min="-50" :max="50" :step="1">
          <b-slider-tick :value="-20">{{ -20 | T("°C") }}</b-slider-tick>
          <b-slider-tick :value="-10">{{ -10 | T("°C") }}</b-slider-tick>
          <b-slider-tick :value="0">{{ 0 | T("°C") }}</b-slider-tick>
          <b-slider-tick :value="15">{{ 15 | T("°C") }}</b-slider-tick>
          <b-slider-tick :value="20">{{ 20 | T("°C") }}</b-slider-tick>
          <b-slider-tick :value="30">{{ 30 | T("°C") }}</b-slider-tick>
        </b-slider>
        <p class="control">
          <b-tag
            >{{ Math.min(temperature) | T("°C") }} /
            {{ Math.max(temperature) | T("°C") }}</b-tag
          >
        </p>
      </b-field>
      <div class="content">
        <pre>
        {{ asText }}
      </pre
        >
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button label="Close" @click="$emit('close')" />
      <b-button
        label="Add"
        @click="$emit('append', asText)"
        type="is-primary"
      />
    </footer>
  </div>
</template>

<style>
.b-slider .b-slider-thumb-wrapper.has-indicator .b-slider-thumb {
  padding: 0.8em 0.3em;
}
</style>
<script>
import BDirection from "@/components/buefy/BDirection";

// eslint-disable-next-line no-unused-vars
import {
  Pressure,
  Azimuth,
  Distance,
  Speed,
  Temperature
} from "@/models/Quantities";

export default {
  name: "BAtis",
  components: [BDirection],
  data() {
    return {
      qnh: 1.034,
      wind: { direction: undefined, speed: undefined },
      visibility: 10000,
      clouds: [
        { height: undefined, cover: undefined },
        { height: undefined, cover: undefined },
        { height: undefined, cover: undefined }
      ],
      temperature: [10, 15]
    };
  },
  computed: {
    asText() {
      return `Q${this.qnh} W${this.wind.direction}/${this.wind.peed} V${
        this.visibility
      } T${Math.max(...this.temperature)}/${Math.min(...this.temperature)}`;
    }
  },
  filters: {
    P(val, unit) {
      return new Pressure(val, unit);
    },
    A(val, unit) {
      return new Azimuth(val, unit);
    },
    T(val, unit) {
      return new Temperature(val, unit);
    },
    D(val, unit) {
      return new Distance(val, unit);
    },
    S(val, unit) {
      return new Speed(val, unit);
    }
  }
};
</script>
