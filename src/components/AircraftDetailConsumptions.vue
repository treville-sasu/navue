<template>
  <section>
    <b-button @click="value.unshift({ ...proto })" type="is-primary" rounded
      >Add a consumption rate</b-button
    >
    <div class="control">
      <b-field v-for="(consumption, index) in value" :key="index" horizontal>
        <b-field label="Name" label-position="on-border" expanded>
          <b-input v-model="consumption.name" />
        </b-field>
        <b-field label="Fuel" label-position="on-border">
          <b-numberinput
            v-model="consumption.value"
            :controls="false"
            :step="0.01"
          />
          <b-select placeholder="vol." v-model="consumption.volume">
            <option
              v-for="(ratio, name) in units.volume"
              :value="name"
              :key="name"
              >{{ name }}</option
            >
          </b-select>
          <b-select placeholder="cons." v-model="consumption.unit">
            <option
              v-for="option in units.consumptions"
              :value="option"
              :key="option"
              >{{ option }}</option
            >
          </b-select>
        </b-field>
        <b-button
          @click="value.splice(index, 1)"
          type="is-secondary"
          icon-right="close"
        />
      </b-field>
    </div>
  </section>
</template>

<script>
import { UnitSystem } from "@/mixins/apputils";

export default {
  name: "AircraftDetailConsumptions",
  props: {
    value: {
      default() {
        return [
          {
            name: undefined,
            value: undefined,
            volume: "L",
            unit: undefined,
          },
        ];
      },
    },
  },
  mixins: [UnitSystem],
  data() {
    return {
      proto: {
        name: undefined,
        value: undefined,
        volume: "L",
        unit: undefined,
      },
    };
  },
  watch: {
    value: {
      deep: true,
      handler(oldVal, newVal) {
        this.$emit("input", newVal);
      },
    },
  },
};
</script>
