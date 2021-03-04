<template>
  <section>
    <b-field label="Balanced on">
      <b-datepicker
        v-model="curatedDate"
        placeholder="Select last value sheet date"
        trap-focus
        icon="calendar-today"
      />
    </b-field>

    <b-table :data="value.weights">
      <b-table-column label="Name" v-slot="props">
        <b-input v-model="props.row.name" />
      </b-table-column>
      <b-table-column label="Arm" v-slot="props">
        <b-numberinput :controls="false" :step="0.1" v-model="props.row.arm" />
      </b-table-column>
      <b-table-column label="Minimum" v-slot="props">
        <b-numberinput :controls="false" :step="0.1" v-model="props.row.min" />
      </b-table-column>
      <b-table-column label="Maximum" v-slot="props">
        <b-numberinput :controls="false" :step="0.1" v-model="props.row.max" />
      </b-table-column>
      <b-table-column label="Weight" v-slot="props">
        <b-field>
          <b-numberinput v-model="props.row.displayValue" :controls="false" />
          <b-select v-model="props.row.unit" required>
            <option
              v-for="(ratio, name) in props.row.constructor.units"
              :value="name"
              :key="name"
            >
              {{ name }}
            </option>
          </b-select>
        </b-field>
      </b-table-column>
      <b-table-column label="Density" v-slot="props">
        <b-numberinput
          v-model="props.row.density"
          :controls="false"
          :step="0.001"
        />
      </b-table-column>
      <b-table-column v-slot="props">
        <b-checkbox-button
          v-model="props.row.tank"
          :native-value="true"
          type="is-primary"
          >Tank</b-checkbox-button
        >
      </b-table-column>
      <b-table-column v-slot="props">
        <b-button
          @click="removeItem(props.row)"
          type="is-secondary"
          icon-right="close"
        />
      </b-table-column>
      <template #empty>
        Add weights values to allow Balance and MTOW calculation.
      </template>
    </b-table>
    <b-button @click="addItem" type="is-primary">Add a weight</b-button>
  </section>
</template>

<script>
// TODO: implement density in Weight

import { Weight } from "@/models/Quantities.js";

export default {
  name: "AircraftDetailBalance",
  props: ["value"],
  data() {
    return {
      checkedRows: []
    };
  },
  computed: {
    // TODO: check if still needed with buefy 0.9.3
    curatedDate: {
      get() {
        return this.value.date ? new Date(this.value.date) : this.value.date;
      },
      set(value) {
        this.value.date = value;
      }
    }
  },
  methods: {
    addItem() {
      this.value.weights.push(
        new Weight(undefined, undefined, undefined, { name: undefined })
      );
    },
    removeItem(item) {
      this.value.weights.splice(this.value.weights.indexOf(item), 1);
    }
  },
  watch: {
    value: {
      deep: true,
      handler(oldVal, newVal) {
        this.$emit("input", newVal);
      }
    }
  }
};
</script>
