<template>
  <b-field>
    <b-numberinput
      v-model="local.value"
      v-bind="$attrs"
      :editable="!$attrs.readonly"
      lazy
    />

    <b-input
      v-if="$attrs.readonly"
      v-model="local.unit"
      v-bind="$attrs"
      readonly
    />
    <b-select v-else v-model="local.unit" v-bind="$attrs" required>
      <option v-for="(ratio, name) in units" :value="name" :key="name">
        {{ name }}
      </option>
    </b-select>
  </b-field>
</template>

<script>
import { Frequency } from "@/models/Quantities.js";

export default {
  name: "BFrequency",
  props: {
    value: {
      type: Frequency,
      default() {
        return new Frequency();
      }
    }
  },
  data() {
    return {
      local: this.value,
      units: Frequency.units
    };
  },

  watch: {
    local: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>
