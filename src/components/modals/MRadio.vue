<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Frequency
      </p>
      <b-button
        label="Add"
        @click="$emit('append', asText), $emit('close')"
        type="is-primary"
      />
    </header>
    <section class="modal-card-body">
      <b-field grouped group-multiline>
        <b-input v-model="freq.name" aria-placeholder="name" />
        <b-numberinput
          v-model="freq.value"
          controls-position="compact"
          min="0"
        />
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
