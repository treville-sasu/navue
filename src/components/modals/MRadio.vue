<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <h2 class="tite">
        ATIS
      </h2>
    </header>
    <section class="modal-card-body">
      <b-field>
        <b-input v-model="freq.name" />
        <b-numberinput v-model="freq.value" />
        <b-field>
          <b-radio-button
            v-model="freq.unit"
            v-for="(f, n) in freq.constructor.units"
            :key="n"
            :native-value="n"
          >
            {{ n }}
          </b-radio-button>
        </b-field>
      </b-field>
      <b-field label="Presets">
        <b-radio-button
          v-model="freq"
          v-for="(p, i) in presets"
          :key="i"
          :native-value="p"
        >
          {{ p.name }}
        </b-radio-button>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button label="Close" @click="$emit('close')" />
      <b-button
        label="Add"
        @click="$emit('append', asText), $emit('close')"
        type="is-primary"
      />
    </footer>
  </div>
</template>

<script>
import { Frequency } from "@/models/Quantities";

export default {
  name: "BRadio",
  data() {
    return {
      freq: new Frequency(0, "MHz"),
      presets: [
        new Frequency(121.5, "MHz", { name: "Emergency" }),
        new Frequency(123.45, "MHz", { name: "Air/Air" }),
        new Frequency(123.5, "MHz", { name: "A/A" }),
        new Frequency(130, "MHz", { name: "Montagne" })
      ]
    };
  },
  computed: {
    asText() {
      return `${this.freq.name || "-"}: ${this.freq}`;
    }
  }
};
</script>
