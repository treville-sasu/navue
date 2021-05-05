<template>
  <b-field>
    <b-numberinput
      v-model="value.value"
      v-bind="$attrs"
      :editable="!$attrs.readonly"
    />

    <b-input
      v-if="$attrs.readonly"
      v-model="value.unit"
      v-bind="$attrs"
      readonly
    />
    <b-select v-else v-model="value.unit" v-bind="$attrs" required>
      <option v-for="(ratio, name) in units" :value="name" :key="name">
        {{ name }}
      </option>
    </b-select>
  </b-field>
</template>

<script>
import { Weight } from "@/models/Quantities.js";

export default {
  name: "BWeight",
  props: {
    value: {
      type: Weight,
      default() {
        return new Weight();
      }
    }
  },
  data() {
    return {
      units: Weight.units
    };
  },

  watch: {
    value: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>
