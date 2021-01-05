<template>
  <b-field>
    <b-numberinput v-model="input" v-bind="$attrs" />
    <b-select v-model="select">
      <slot />
      <option v-for="(ratio, name) in options" :value="name" :key="name">
        {{ name }}
      </option>
    </b-select>
  </b-field>
</template>

<script>
import UnitSystem from "@/mixins/UnitSystem.js";

export default {
  name: "BNumberSelect",
  props: ["value", "quantity", "options"],
  mixins: [UnitSystem],
  computed: {
    input: {
      set(val) {
        this.$emit("update:value", val / this.options[this.quantity]);
      },
      get() {
        return this.value * this.options[this.quantity];
      }
    },
    select: {
      set(val) {
        this.$emit("update:quantity", val);
      },
      get() {
        return this.quantity;
      }
    }
  }
};
</script>
