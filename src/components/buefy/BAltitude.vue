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

    <b-input
      v-if="$attrs.readonly"
      v-model="local.reference"
      v-bind="$attrs"
      readonly
    />
    <b-select v-else v-model="local.reference" v-bind="$attrs" required>
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
      local: this.value,
      references: Altitude.references,
      units: Altitude.units
    };
  },

  watch: {
    local: {
      deep: true,
      handler(val) {
        if ("FL" == val.unit) val.reference = "QNE";
        else if (!val.reference) val.reference = "MSL";
        if (!val.unit) val.unit = "ft";

        this.$emit("input", val);
      }
    }
  }
};
</script>
