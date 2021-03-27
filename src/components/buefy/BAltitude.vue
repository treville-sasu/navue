<template>
  <b-field>
    <b-numberinput v-model="displayValue" v-bind="$attrs" />
    <b-select v-model="unit" required>
      <option v-for="(ratio, name) in units" :value="name" :key="name">
        {{ name }}
      </option>
    </b-select>
    <b-select v-model="reference" required>
      <option v-for="ref in references" :value="ref" :key="ref">
        {{ ref }}
      </option>
    </b-select>
  </b-field>
</template>

<script>
import { Altitude } from "@/models/Quantities.js";
export default {
  name: "BAltitude",
  props: {
    value: {
      type: Altitude,
      default() {
        return new Altitude();
      }
    }
  },
  data() {
    return {
      references: Altitude.references,
      units: Altitude.units
    };
  },
  computed: {
    displayValue: {
      get() {
        return this.value.displayValue;
      },
      set(val) {
        this.update(val, this.unit, this.reference);
      }
    },
    unit: {
      get() {
        return this.value.unit;
      },
      set(val) {
        this.update(this.displayValue, val, this.reference);
      }
    },
    reference: {
      get() {
        return this.value.reference;
      },
      set(val) {
        this.update(this.displayValue, this.unit, val);
      }
    }
  },
  methods: {
    update(value, unit, reference) {
      if ("FL" == unit) reference = "QNE";
      if (!unit) unit = "ft";
      if (!reference) reference = "MSL";
      this.$emit("input", new Altitude(value, unit, reference));
    }
  }
};
</script>
