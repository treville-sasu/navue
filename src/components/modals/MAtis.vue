<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        ATIS
      </p>
      <b-button
        label="Add"
        @click="$emit('append', asText), $emit('close')"
        type="is-primary"
      />
    </header>
    <section class="modal-card-body">
      <b-field grouped horizontal label="QNH">
        <b-slider
          :value="qnh.value"
          @input="qnh.value.value = $event"
          :min="qnh.min.value"
          :max="qnh.max.value"
          :step="qnh.step"
          expanded
          :tooltip="false"
        >
          <b-slider-tick :value="qnh.min.value">{{ qnh.min }}</b-slider-tick>
          <b-slider-tick :value="qnh.standart.value">Sdt</b-slider-tick>
          <b-slider-tick :value="qnh.max.value">{{ qnh.max }}</b-slider-tick>
        </b-slider>
        <p class="control">
          <b-tag>{{ qnh.value }}</b-tag>
        </p>
      </b-field>
      <b-field horizontal label="Wind Direction">
        <b-slider
          :value="windDirection.value"
          @input="windDirection.value.value = $event"
          :min="windDirection.N.value"
          :max="windDirection.max.value"
          :step="windDirection.step"
          expanded
          :tooltip="false"
        >
          <b-slider-tick :value="windDirection.N.value">N</b-slider-tick>
          <b-slider-tick :value="windDirection.E.value">E</b-slider-tick>
          <b-slider-tick :value="windDirection.S.value">S</b-slider-tick>
          <b-slider-tick :value="windDirection.W.value">W</b-slider-tick>
        </b-slider>
        <p class="control">
          <b-tag>{{ windDirection.value }}</b-tag>
        </p>
      </b-field>
      <b-field horizontal label="Wind Speed">
        <b-slider
          :value="windSpeed.value"
          @input="windSpeed.value.value = $event"
          :max="windSpeed.max.value"
          :step="windSpeed.step"
          expanded
          :tooltip="false"
        />
        <p class="control">
          <b-tag>{{ windSpeed.value }}</b-tag>
        </p>
      </b-field>
      <b-field horizontal grouped label="Visibility">
        <b-slider
          :value="visibility.value"
          @input="visibility.value.value = $event"
          :max="visibility.max.value"
          :step="visibility.step"
          expanded
          :tooltip="false"
        >
          <b-slider-tick :value="0">{{ 0 | D("Km") }}</b-slider-tick>
          <b-slider-tick :value="visibility.VFRS.value"
            >> {{ visibility.VFRS }}</b-slider-tick
          >
          <b-slider-tick :value="visibility.VFR.value"
            >> {{ visibility.VFR }}</b-slider-tick
          >
          <b-slider-tick :value="visibility.max.value"
            >> {{ visibility.max }}</b-slider-tick
          >
        </b-slider>
        <p class="control">
          <b-tag>{{ visibility.value }}</b-tag>
        </p>
      </b-field>
      <b-field horizontal label="Temperature">
        <b-slider
          :value="temperature.value"
          @input="temperature.value = $event"
          :min="temperature.min.value"
          :max="temperature.max.value"
          :step="temperature.step"
          expanded
          :tooltip="false"
        >
          <b-slider-tick :value="0">{{ 0 }}</b-slider-tick>
          <b-slider-tick :value="15">{{ 15 }}</b-slider-tick>
        </b-slider>
        <p class="control">
          <b-tag
            >{{ Math.min(...temperature.value) }} /
            {{ Math.max(...temperature.value) }}</b-tag
          >
        </p>
      </b-field>
      <div class="content">
        <pre>{{ asText }}</pre>
      </div>
    </section>
  </div>
</template>

<style>
.b-slider .b-slider-thumb-wrapper.has-indicator .b-slider-thumb {
  padding: 0.8em 0.3em;
}
</style>
<script>
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
  data() {
    return {
      qnh: {
        min: new Pressure(950, "hPa"),
        max: new Pressure(1040, "hPa"),
        standart: new Pressure(1013.25, "hPa"),
        step: 1,
        value: new Pressure(1013, "hPa")
      },
      windDirection: {
        N: new Azimuth(0, "°"),
        E: new Azimuth(90, "°"),
        S: new Azimuth(180, "°"),
        W: new Azimuth(270, "°"),
        max: { value: 360 },
        step: 10,
        value: new Azimuth(0, "°")
      },
      windSpeed: {
        max: new Speed(60, "kt"),
        step: 5,
        value: new Speed(0, "kt")
      },
      visibility: {
        VFR: new Distance(1.5, "Km"),
        VFRS: new Distance(5, "Km"),
        max: new Distance(10, "Km"),
        step: 0.5,
        value: new Distance(10, "Km")
      },
      temperature: {
        min: new Temperature(-40, "°C"),
        max: new Temperature(40, "°C"),
        zero: new Temperature(0, "°C"),
        standart: new Temperature(15, "°C"),
        step: 1,
        value: [new Temperature(10, "°C"), new Temperature(15, "°C")]
      },
      clouds: [
        { height: undefined, cover: undefined },
        { height: undefined, cover: undefined },
        { height: undefined, cover: undefined }
      ]
    };
  },
  computed: {
    asText() {
      return `Q${this.qnh.value} | W${this.windDirection.value}/${
        this.windSpeed.value
      } | V${this.visibility.value} | T${Math.max(
        ...this.temperature.value
      )}/${Math.min(...this.temperature.value)}`;
    }
  }
};
</script>
