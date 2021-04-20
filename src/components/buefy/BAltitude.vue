<template>
  <b-field>
    <b-numberinput v-model="value.value" v-bind="$attrs" />
    <b-select v-model="value.unit" required>
      <option v-for="(ratio, name) in units" :value="name" :key="name">
        {{ name }}
      </option>
    </b-select>
    <b-select v-model="value.reference" required>
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

  watch: {
    value: {
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
