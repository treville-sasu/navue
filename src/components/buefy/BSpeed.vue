<template>
  <b-field>
    <b-numberinput
      v-model="value.value"
      v-bind="$attrs"
      :editable="!$attrs.readonly"
      lazy
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
import { Speed } from "@/models/Quantities.js";

export default {
  name: "BSpeed",
  props: {
    value: {
      type: Speed,
      default() {
        return new Speed();
      }
    }
  },
  data() {
    return {
      units: Speed.units
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
